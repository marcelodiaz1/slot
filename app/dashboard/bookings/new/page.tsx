import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ArrowLeft, Calendar } from 'lucide-react'
import Link from 'next/link'
import { NewBookingForm } from './NewBookingForm'

export default async function NewManualBookingPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 1. Determine the "Boss ID" (The source of truth for clients)
  const bossId = profile?.role === 'teammember' ? profile.parent_id : profile?.id;
  const brandColor = profile?.brand_color || '#2563eb';
  const displayUsername = profile?.username || "Professional";

  // 2. FETCH REGISTERED CLIENTS
  const { data: registeredClients } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, email')
    .eq('role', 'client')
    .eq('parent_id', bossId);

  // 3. FETCH GUEST CLIENTS
  const { data: guestBookings } = await supabase
    .from('bookings')
    .select('client_id, guest_name, guest_email, doctor_id')
    .eq('doctor_id', bossId)
    .is('client_id', null);

  // 4. CONSOLIDATE & UNIFY
  const clientMap = new Map();

  registeredClients?.forEach(c => {
    clientMap.set(c.id, {
      client_id: c.id,
      doctor_id: bossId,
      guest_name: `${c.first_name} ${c.last_name}`,
      guest_email: c.email,
      isGuest: false
    });
  });

  guestBookings?.forEach(b => {
    if (b.guest_email && !clientMap.has(b.guest_email)) {
      clientMap.set(b.guest_email, {
        client_id: null,
        doctor_id: bossId,
        guest_name: b.guest_name,
        guest_email: b.guest_email,
        isGuest: true
      });
    }
  });

  const allClients = Array.from(clientMap.values());

  // 5. Fetch Pros and Event Types
  const [{ data: allPros }, { data: eventTypes }] = await Promise.all([
    supabase.from('profiles') 
      .select('id, username, first_name, last_name, parent_id, role')
      .in('role', ['pro', 'teammember'])
      .not('username', 'is', null),
    supabase.from('event_types')
      .select('id, title, duration')
      .order('title', { ascending: true })
  ]);

  return (
    <div className="max-w-xl mx-auto p-4 md:p-8">
      {/* Back Button Link */}
      <Link 
        href="/dashboard" 
        className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center gap-2 mb-8 transition-colors group"
      >
        <div className="p-2 bg-white rounded-lg border border-slate-100 group-hover:border-slate-200 shadow-sm">
          <ArrowLeft size={16} />
        </div>
        Back to Dashboard
      </Link>

      <div className="space-y-8 mb-8">
        <header>
          <div className="flex items-center gap-4 mb-2">
            {/* The "Tile" icon container */}
            <div 
              style={{ backgroundColor: brandColor }} 
              className="p-4 rounded-[1.25rem] text-white shadow-xl shadow-blue-500/10"
            >
              <Calendar size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                New Booking
              </h1>
              <p className="text-slate-400 text-sm font-bold">
                Scheduling as <span className="text-slate-600">{displayUsername}</span>
              </p>
            </div>
          </div>
        </header>
      </div>

      <NewBookingForm 
        integrations={profile?.integrations}
        eventTypes={eventTypes || []}   
        username={profile?.username || ""} 
        viewer={profile}
        allClients={allClients}
        allPros={allPros || []} 
      />
    </div>
  )
}