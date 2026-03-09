import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Usamos tus credenciales que sí funcionan
const SUPABASE_CONFIG = {
  url: "https://desayknagbnkkfisdwyg.supabase.co",
  anonKey: "sb_publishable_tE-sDGZUqCFqWmv09FCafw_J-5tTNq1"
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