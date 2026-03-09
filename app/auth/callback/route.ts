import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// 1. Force TypeScript to treat these as strings using '!'
const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  serviceKey: (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard/settings'

  if (code) {
    const supabase = await createAdminClient()
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.session) {
      const providerToken = data.session.provider_refresh_token
      const userId = data.session.user.id

      if (providerToken) {
        // Fetch current profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('integrations')
          .eq('id', userId)
          .single()

        // Update with the new token
        await supabase
          .from('profiles')
          .update({ 
            google_refresh_token: providerToken,
            integrations: { 
               ...(profile?.integrations || {}), 
               google_meet: true, 
               google_calendar: true 
            }
          })
          .eq('id', userId)
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}

async function createAdminClient() {
  const cookieStore = await cookies()
  
  // We use the '!' here as well to satisfy the 'string' requirement
  return createServerClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.serviceKey, 
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // Server Component context restriction
          }
        },
      },
    }
  )
}