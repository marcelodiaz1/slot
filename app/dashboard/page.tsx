import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CalendarView } from './CalendarView'
import { AdminDashboard } from './AdminDashboard'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 1. Fetch the profile of the logged-in user
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, first_name, last_name, brand_color, username, parent_id')
    .eq('id', user.id)
    .single()
 
 let query = supabase.from('bookings').select(`
  *,
  event_types (
    id,
    title,
    duration
  ),
  doctor:profiles!bookings_doctor_id_fkey (
    username,
    first_name,
    last_name
  )
`)

  // 3. Role-based Filters
  let viewerIds = [user.id]

  if (profile?.role === 'pro') {
    const { data: teamMembers } = await supabase
      .from('profiles')
      .select('id')
      .eq('parent_id', user.id)
    
    if (teamMembers) {
      viewerIds = [...viewerIds, ...teamMembers.map(m => m.id)]
    }
    query = query.in('doctor_id', viewerIds)
  } 
  else if (profile?.role === 'teammember') {
    query = query.eq('doctor_id', user.id)
  }
  else if (profile?.role === 'client') {
    query = query.or(`client_id.eq.${user.id},guest_email.eq.${user.email}`)
  }

  // 4. Final Execution
  const { data: bookings, error } = await query.order('start_time', { ascending: true })

  if (error) {
    console.error("Query Error:", error.message)
  }

  // Admin Stats
  const { count: proCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'pro')
  const { count: clientCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client')

  if (profile?.role === 'admin') {
    return <AdminDashboard 
        bookings={bookings || []} 
        user={profile} 
        stats={{ pros: proCount || 0, clients: clientCount || 0 }} 
      />
  }

  return (
    <CalendarView 
      initialBookings={bookings || []} 
      initialData={profile} 
      viewer={profile} 
    />
  )
}