import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation' 
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { EditBookingFormClient } from './EditBookingFormClient'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 1. Fetch Profile and Booking first to determine permissions
  const [profileRes, bookingRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('bookings').select('*').eq('id', id).single()
  ])

  if (!bookingRes.data) return notFound()
  const profile = profileRes.data

  // 2. Determine the "Owner" (The Pro/Boss) for client list fetching
  const ownerId = profile?.role === 'teammember' ? profile.parent_id : profile?.id

  // 3. Fetch all other dependencies
  const [eventTypesRes, teamRes, allProsRes, clientBookingsRes] = await Promise.all([
    supabase.from('event_types')
      .select('id, title, duration')
      .or(`user_id.eq.${ownerId},user_id.is.null`)
      .order('title', { ascending: true }),
    
    supabase.from('profiles')
      .select('id, first_name, last_name, username, role, parent_id')
      .eq('parent_id', ownerId)
      .eq('role', 'teammember'),
    
    supabase.from('profiles')
      .select('id, first_name, last_name, username')
      .in('role', ['pro', 'teammember']),

    supabase.from('bookings')
      .select('client_id, guest_name, guest_email, doctor_id')
      .eq('doctor_id', ownerId)
      .not('client_id', 'is', null)
  ])

  return (
    <div className="max-w-xl mx-auto p-4 md:p-8">
      <Link href="/dashboard" className="text-sm font-bold text-slate-400 hover:text-blue-600 flex items-center gap-2 mb-8 transition-colors group">
        <div className="p-2 bg-white rounded-lg border border-slate-100 group-hover:border-blue-100 shadow-sm">
          <ArrowLeft size={16} />
        </div>
        Back to Dashboard
      </Link>
      
      <EditBookingFormClient 
        id={id}
        integrations={profile.integrations}
        booking={bookingRes.data}
        eventTypes={eventTypesRes.data || []}
        allClients={clientBookingsRes.data || []}
        viewer={profile}
        teamMembers={teamRes.data || []}
        allPros={allProsRes.data || []} 
      />
    </div>
  )
}