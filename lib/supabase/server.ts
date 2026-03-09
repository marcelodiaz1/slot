import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server';
// Import YOUR server client creator 

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect address
  const next = searchParams.get('next') ?? '/dashboard/settings';

  if (code) {
    const supabase = await createClient();
    
    // 1. Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.session) {
      const providerToken = data.session.provider_refresh_token;
      const userId = data.session.user.id;

      // 2. ONLY if we got a provider_refresh_token, save it to the profile
      if (providerToken) {
        await supabase
          .from('profiles')
          .update({ 
            google_refresh_token: providerToken,
            // Force the integration UI to stay 'true'
            integrations: { 
               ...data.session.user.user_metadata?.integrations, 
               google_meet: true, 
               google_calendar: true 
            }
          })
          .eq('id', userId);
      }
    }
  }

  // return the user to an internal page
  return NextResponse.redirect(`${origin}${next}`);
}
// Usamos tus credenciales que sí funcionan
const SUPABASE_CONFIG = {
  url: "https://desayknagbnkkfisdwyg.supabase.co",
  anonKey: "sb_publishable_tE-sDGZUqCFqWmv09FCafw_J-5tTNq1",
  serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
}

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Safe to ignore in Server Components
          }
        },
      },
    }
  )
}