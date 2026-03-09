import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation' 
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Mail, Video, MapPin, Edit2 } from 'lucide-react' 
// Ensure this path is correct for your project 
import DeleteBookingButton from './edit/DeleteBookingButton'

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, bookingRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('bookings').select('*').eq('id', id).single()
  ])

  if (!bookingRes.data) return notFound()
  const booking = bookingRes.data
  const profile = profileRes.data
  const brandColor = profile?.brand_color || '#2563eb'

  return (
    <div className="max-w-xl mx-auto p-4 md:p-8">
      <Link href="/dashboard" className="text-sm font-bold text-slate-400 hover:text-blue-600 flex items-center gap-2 mb-8 transition-colors group">
        <div className="p-2 bg-white rounded-lg border border-slate-100 group-hover:border-blue-100 shadow-sm">
          <ArrowLeft size={16} />
        </div>
        Back to calendar
      </Link>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <h1 className="text-2xl font-black text-slate-900">Appointment <span style={{ color: brandColor }} >Details</span></h1>
          <p className="text-slate-500 font-medium uppercase text-[10px] tracking-widest mt-1">Booking ID: {id}</p>
        </div>

        <div className="p-8 space-y-6">
          {/* GUEST INFO */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><User size={20}/></div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-tight">Guest Name</p>
              <p className="font-bold text-slate-900">{booking.guest_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Mail size={20}/></div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-tight">Email Address</p>
              <p className="font-bold text-slate-900">{booking.guest_email}</p>
            </div>
          </div>

          {/* TIME INFO */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Calendar size={20}/></div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-tight">Date & Time</p>
              <p className="font-bold text-slate-900">
                {new Date(booking.start_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                <span className="text-slate-400 mx-2">@</span>
                {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* LOCATION INFO */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
              {booking.meeting_link ? <Video size={20}/> : <MapPin size={20}/>}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-tight">Location</p>
              {booking.meeting_link ? (
                <a href={booking.meeting_link} target="_blank" className="font-bold text-blue-600 underline">Join Online Meeting</a>
              ) : (
                <p className="font-bold text-slate-900">In-Person Session</p>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
            <Link 
              style={{ backgroundColor: brandColor }} 
              href={`/dashboard/bookings/${id}/edit`} 
              className="flex items-center justify-center gap-2 p-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
            >
              <Edit2 size={18} /> Edit
            </Link>
            
            <DeleteBookingButton id={id} guestName={booking.guest_name} />
          </div>
        </div>
      </div>
    </div>
  )
}