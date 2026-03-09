'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from "@/utils/supabase/admin";  
// --- BOOKINGS ---

export async function deleteBooking(bookingId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId)

  if (error) {
    console.error('Delete error:', error.message)
    throw new Error('Failed to delete booking')
  }

  // 1. Clear the cache so the dashboard reflects the missing booking
  revalidatePath('/dashboard')
  
  // 2. Send the user away from the now-deleted resource
  redirect('/dashboard') 
}

export async function updateBooking(bookingId: string, formData: FormData) {
  const supabase = await createClient()
  
  // 1. Extract the base data
  const guest_name = formData.get('guest_name') as string
  const guest_email = formData.get('guest_email') as string
  const start_time = formData.get('start_time') as string
  const event_type_id = formData.get('event_type_id') as string
  
  // 2. Extract the new location data
  const location_type = formData.get('location_type') as string // 'online' or 'in_person'
  const preferred_provider = formData.get('preferred_provider') as string // 'zoom' or 'google_meet'

  // 3. Prepare the update object
  const updates: any = {
    guest_name,
    guest_email,
    start_time,
    event_type_id,
  }

  // 4. Handle Video Meeting Logic
  if (location_type === 'online') {
    updates.meeting_type = preferred_provider
    
    // Logic: If switching to online, we need a meeting link.
    // If your 'handleCreateBooking' uses a helper, call it here.
    // updates.meeting_link = await generateMeetingLink(preferred_provider, start_time)
  } else {
    // If switching back to In-Person, clear the link and type
    updates.meeting_link = null
    updates.meeting_type = null
  }

  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select() 

  if (error) throw new Error(error.message)

  if (data && data.length > 0) {
    revalidatePath('/dashboard')
    // Revalidate the specific booking detail page too if you have one
    revalidatePath(`/dashboard/bookings/${bookingId}`)
    redirect('/dashboard')
  }
}

// --- PROFILE & SETTINGS ---

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: "Not authenticated" }

  // Extracting new fields from formData
  const first_name = formData.get('first_name') as string
  const last_name = formData.get('last_name') as string
  const phone = formData.get('phone') as string
  const username = formData.get('username') as string

  const { error } = await supabase
    .from('profiles')
    .update({ 
      first_name, 
      last_name, 
      phone, 
      username: `${first_name} ${last_name}`.trim()
    })
    .eq('id', user.id)

  if (error) {
    if (error.code === '23505') return { error: "Username already taken" }
    return { error: error.message }
  }

  revalidatePath('/dashboard/settings')
  return { success: true, error: null }
}
 
// --- AVAILABILITY ---

export async function updateAvailability(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const days = ['0', '1', '2', '3', '4', '5', '6']
  const availabilityData = days.map(day => {
    const enabled = formData.get(`enabled-${day}`) === 'on'
    if (!enabled) return null

    return {
      user_id: user.id,
      day_of_week: parseInt(day),
      start_time: formData.get(`start-${day}`) as string,
      end_time: formData.get(`end-${day}`) as string,
    }
  }).filter(Boolean) as any[]

  await supabase.from('availability').delete().eq('user_id', user.id)

  if (availabilityData.length > 0) {
    const { error } = await supabase.from('availability').insert(availabilityData)
    if (error) return { error: error.message }
  }

  revalidatePath('/dashboard/availability')
  return { success: true }
}

// --- BOOKING FLOW ---

export async function getAvailableSlotsAction(userId: string, dateIso: string, duration: number) {
  const supabase = await createClient()
  const date = new Date(dateIso)
  const dayOfWeek = date.getDay()

  const { data: availability, error } = await supabase
    .from('availability')
    .select('start_time, end_time')
    .eq('user_id', userId)
    .eq('day_of_week', dayOfWeek)
    .single()

  if (error || !availability) return []

  const slots: string[] = []
  let [startHour, startMin] = availability.start_time.split(':').map(Number)
  let [endHour, endMin] = availability.end_time.split(':').map(Number)

  let current = new Date(date)
  current.setHours(startHour, startMin, 0)
  const endTime = new Date(date)
  endTime.setHours(endHour, endMin, 0)

  while (current < endTime) {
    slots.push(current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }))
    current.setMinutes(current.getMinutes() + duration)
  }

  return slots
}

export async function confirmBooking(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('bookings').insert({
    event_type_id: formData.get('eventTypeId'),
    guest_name: formData.get('guestName'),
    guest_email: formData.get('guestEmail'),
    start_time: formData.get('startTime'),
  })
  if (error) throw new Error(error.message)
  redirect('/success')
}

export async function createSlot(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('event_types').insert([{ 
    title: formData.get('title'), 
    duration: Number(formData.get('duration')), 
    slug: formData.get('slug'), 
    user_id: user.id 
  }])

  if (error) return 
  revalidatePath('/dashboard')
  redirect('/dashboard')
}
 
export async function deletePro(id: string) {
  // Use the admin client to bypass RLS 
  const supabaseAdmin = await createClient();
  console.log("Admin attempting deletion of ID:", id);

  const { error } = await supabaseAdmin
    .from('profiles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Delete Error:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/pros');
  return { success: true };
}

export async function updateProStatus(id: string, action: "archive" | "block" | "unarchive") {
  const supabase = await createClient();
  
  let updateData = {};

  if (action === "archive") {
    // Hidden from public, but user can still log in
    updateData = { is_archived: true, visibility: 'hidden' };
  } else if (action === "block") {
    // User cannot log in (requires a check in your middleware or login flow)
    updateData = { is_blocked: true, visibility: 'hidden' };
  } else if (action === "unarchive") {
    updateData = { is_archived: false, visibility: 'public' };
  }

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard/pros');
}

export async function signOut() {
  const supabase = await createClient();
  
  // 1. Tell Supabase to invalidate the session
  await supabase.auth.signOut();
  
  // 2. Clear cookies and redirect to the home page or login
  redirect("/");
}