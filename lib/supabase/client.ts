import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Hardcode temporal para saltar el error del .env
  return createBrowserClient(
    "https://desayknagbnkkfisdwyg.supabase.co",
    "sb_publishable_tE-sDGZUqCFqWmv09FCafw_J-5tTNq1"
  )
}