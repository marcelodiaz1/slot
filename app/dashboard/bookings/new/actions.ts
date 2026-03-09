'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { createZoomMeeting } from '@/utils/zoomProvider'
import { createGoogleMeet } from '@/utils/googleProvider'
import { redirect } from 'next/navigation'

/**
 * HELPER: Logic to decide and generate the meeting link based on user selection
 */

async function generateMeetingLink(
  supabase: any, 
  doctorId: string, 
  details: { start: Date, duration: number, title: string, provider: string }
) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('integrations, zoom_refresh_token, google_refresh_token')
    .eq('id', doctorId)
    .single();

  if (!profile?.integrations) return null;

  // LOGIC: Use a Switch or if/else to avoid "falling through" to Zoom
  if (details.provider === 'google_meet') {
    if (!profile.google_refresh_token) {
      console.error("Google Meet selected but NO REFRESH TOKEN found in DB.");
      return null; 
    }
    
    const googleMeeting = await createGoogleMeet(supabase, doctorId, details);
    if (googleMeeting) {
      return { type: 'google_meet', link: googleMeeting.link };
    }
    // If it gets here, Google failed. Do NOT try Zoom.
    return null; 
  }

  if (details.provider === 'zoom') {
    if (!profile.zoom_refresh_token) {
      console.error("Zoom selected but NO REFRESH TOKEN found in DB.");
      return null;
    }

    const zoomMeeting = await createZoomMeeting(supabase, doctorId, details);
    if (zoomMeeting) {
      return { type: 'zoom', link: zoomMeeting.link };
    }
    return null;
  }

  return null;
}
/**
 * MAIN ACTION: Creates the booking record
 */
export async function handleCreateBooking(prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // 1. Extract Data
  const username = formData.get('username') as string;
  const eventTypeId = formData.get('event_type_id') as string;
  const startTimeStr = formData.get('start_time') as string;
  let client_id = formData.get('client_id') as string; 
  const guest_name = formData.get('guest_name') as string;
  const guest_email = formData.get('guest_email') as string;
  const locationType = formData.get('location_type') as string; 
  const preferredProvider = formData.get('preferred_provider') as string;
 console.log("DEBUG: Location Type:", locationType); // Should be 'online'
  console.log("DEBUG: Selected Provider:", preferredProvider); // Should be 'google_meet' or 'zoom'
if (!client_id || client_id === "" || client_id === "null") {
  // 1. Use Admin Client to bypass RLS
  const { createAdminClient } = await import("@/utils/supabase/admin");
  const supabaseAdmin = createAdminClient();

  // 2. Check if this email exists first (prevent duplicates)
  const { data: existingClient } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', guest_email)
    .maybeSingle();

  if (existingClient) {
    client_id = existingClient.id;
  } else {
    // 3. Create new profile
    const nameParts = guest_name.trim().split(' ');
    const first = nameParts[0];
    const last = nameParts.slice(1).join(' ');

    const { data: newProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        email: guest_email,
        first_name: first,
        last_name: last,
        role: 'client',
        // Critical: Generate a valid unique username string
        username: `client-${Date.now()}-${Math.random().toString(36).substring(7)}` 
      })
      .select('id')
      .single();

    if (profileError) {
      console.error("Profile Error:", profileError);
      return { error: 'failed', message: "Could not create guest profile." };
    }
    client_id = newProfile.id; // This is now a valid UUID
  }
}

// 4. Double check client_id is not a name string before inserting
if (client_id.includes(' ')) {
   return { error: 'bad_input', message: "System error: Received name instead of ID." };
}
  // 2. Resolve Professional (Doctor) ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('username', username)
    .single();
  
  if (!profile) return { error: 'not_found', message: 'Professional not found.' };
  const doctor_id = profile.id;

  // 3. Time Calculations
  const { data: eventType } = await supabase
    .from('event_types')
    .select('duration, title')
    .eq('id', eventTypeId)
    .single();

  const duration = eventType?.duration || 30;
  const start = new Date(startTimeStr);
  const end = new Date(start.getTime() + duration * 60000);

  // 4. Conflict Check
  const { data: overlapping } = await supabase
    .from('bookings')
    .select('id')
    .eq('doctor_id', doctor_id)
    .eq('status', 'confirmed')
    .lt('start_time', end.toISOString())
    .gt('end_time', start.toISOString())
    .maybeSingle();

  if (overlapping) {
    return { error: "conflict", message: "Schedule Conflict." };
  }

  // 5. Generate Meeting (Conditional)
  let meeting = { type: 'in_person', link: null as string | null };

  if (locationType === 'online') {
    try {
      const generatedMeeting = await generateMeetingLink(supabase, doctor_id, {
        start,
        duration,
        title: `Meeting with ${guest_name}`,
        provider: preferredProvider 
      });

      if (generatedMeeting) {
        meeting = generatedMeeting;
      }
    } catch (err) {
      console.error("Meeting generation failed:", err);
    }
  }
// SAFETY GATE: If client_id is a name (contains space) or is empty, we MUST create/find a profile
  const isInvalidUuid = !client_id || client_id.includes(' ') || client_id.length < 32;

  if (isInvalidUuid) {
    const { createAdminClient } = await import("@/utils/supabase/admin");
    const supabaseAdmin = createAdminClient();

    // 1. Check if email already exists
    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', guest_email)
      .maybeSingle();

    if (existing) {
      client_id = existing.id;
    } else {
      // 2. Create the profile to get a valid UUID
      const nameParts = guest_name.trim().split(' ');
      const { data: newProfile, error: pError } = await supabaseAdmin
        .from('profiles')
        .insert({
          email: guest_email,
          first_name: nameParts[0],
          last_name: nameParts.slice(1).join(' '),
          role: 'client',
          username: `client-${Date.now()}`
        })
        .select('id')
        .single();

      if (pError) return { error: 'failed', message: "Profile creation failed: " + pError.message };
      client_id = newProfile.id;
    }
  }
  // 6. Insert Booking
  const { error: insertError } = await supabase.from('bookings').insert({
    event_type_id: eventTypeId,
    client_id: client_id,
    doctor_id: doctor_id,  
    guest_name: guest_name,
    guest_email: guest_email || user?.email || null, 
    start_time: start.toISOString(),
    end_time: end.toISOString(),
    status: 'confirmed',
    meeting_type: meeting.type, 
    meeting_link: meeting.link 
  }); 

  if (insertError) return { error: 'db_error', message: insertError.message };

  // 7. Redirect Logic
  revalidatePath('/dashboard');
  revalidatePath(`/${username}`);

  if (!user) return redirect('/success');
  return redirect('/dashboard');
}