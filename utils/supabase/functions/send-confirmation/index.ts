// supabase/functions/send-confirmation/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req: { json: () => PromiseLike<{ record: any }> | { record: any } }) => {
  // 'record' is the new booking row
  const { record } = await req.json() 
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 1. Fetch the Doctor's notification settings using doctor_id
  const { data: doctor } = await supabase
    .from('profiles')
    .select('notifications, email, full_name')
    .eq('id', record.doctor_id)
    .single()

  // 2. The "Switch" Logic
  const wantsEmail = doctor?.notifications?.email_appointments;

  if (wantsEmail && doctor?.email) {
    // 3. Send via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from: 'Appointments <onboarding@resend.dev>', // Use your verified domain here
        to: doctor.email,
        subject: `New Appointment: ${record.client_name || 'New Client'}`,
        html: `
          <h1>New Session Booked!</h1>
          <p>Hi ${doctor.full_name},</p>
          <p>You have a new appointment scheduled for <strong>${record.date}</strong> at <strong>${record.time}</strong>.</p>
          <hr />
          <p>Go to your dashboard to view details.</p>
        `
      }),
    })
    
    return new Response(JSON.stringify({ sent: true }), { status: 200 })
  }

  return new Response(JSON.stringify({ sent: false, reason: 'Notifications disabled' }), { status: 200 })
})