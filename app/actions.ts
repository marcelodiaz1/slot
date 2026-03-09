'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    console.error("Login Error:", error.message)
    return
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const first_name = formData.get('first_name') as string
  const last_name = formData.get('last_name') as string
  const phone = formData.get('phone') as string 
  const username = `${first_name} ${last_name}`.trim()

  // 1. Sign up with Metadata
  const { data: authData, error: authError } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: { 
        username,
        first_name,
        last_name,
        phone
      }
    }
  })

  if (authError) return redirect(`/login?error=${authError.message}`)

  // 2. Manual Profile Insert (Safe way to ensure columns are filled)
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        first_name,
        last_name,
        phone, 
        username,
        role: 'doctor' // Default role
      })
      
    if (profileError) console.error("Profile creation error:", profileError.message)
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function bookSlot(formData: FormData) {
  const supabase = await createClient()

  // 1. Extract and Validate
  const eventId = formData.get('eventId') as string
  const startTime = formData.get('startTime') as string
  const guestName = formData.get('guestName') as string
  const guestEmail = formData.get('guestEmail') as string

  // Simple check to prevent sending nulls to Supabase
  if (!eventId || !startTime || !guestName || !guestEmail) {
    console.error("Booking Error: Missing required fields")
    return
  }

  // 2. Insert into Supabase
  const { error } = await supabase
    .from('bookings')
    .insert([
      {
        event_type_id: eventId,
        start_time: startTime,
        guest_name: guestName,
        guest_email: guestEmail,
      },
    ])

  if (error) {
    // If you still see "row-level security policy", run the SQL fix below!
    console.error('Booking Error:', error.message)
    return 
  }

  // 3. Refresh and Redirect
  revalidatePath('/dashboard') // Update your dashboard table
  redirect('/dashboard?message=success') // Or a dedicated success page
}