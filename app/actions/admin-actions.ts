"use server"

import { createClient } from "@supabase/supabase-js"

export async function adminCreateUser(formData: any, creatorId: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  const { email, password, firstName, lastName, phone, role, username, brandColor } = formData;

  // 1. Create the Auth User (This happens in the 'auth' schema)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, 
    user_metadata: { 
      first_name: firstName, 
      last_name: lastName, 
      phone, 
      role, 
      username, 
      parent_id: creatorId 
    }
  })

  if (authError) return { error: authError.message }

  // 2. Sync to the 'public.profiles' table
  // We use .upsert to handle cases where a database trigger might have already 
  // created a partial row. This "fills in the blanks" for all columns.
  if (authData.user) {
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        role,
        username,
        brand_color: brandColor,
        parent_id: creatorId
      }, { onConflict: 'id' }) // Ensures we update the existing row if it's there

    if (profileError) return { error: profileError.message }
  }

  return { success: true }
}