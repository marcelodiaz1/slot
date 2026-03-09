'use client'

import { useState } from 'react'
import { Calendar, Users, User, CheckCircle2, Video, MapPin } from 'lucide-react'
import { updateBooking } from '@/app/dashboard/actions'
import { ClientSelectorField } from './ClientSelectorField'
import DeleteBookingButton from './DeleteBookingButton'

export function EditBookingFormClient({ id, booking, eventTypes, allClients, viewer, teamMembers, allPros = [], integrations }: any) {
  const isStaff = viewer?.role === 'pro' || viewer?.role === 'teammember' || viewer?.role === 'admin';
  const isClient = viewer?.role === 'client';
  
  const isPro = viewer?.role === 'pro';
  const isTeamMember = viewer?.role === 'teammember'; 
  // Logic from NewBooking
  const brandColor = viewer?.brand_color || '#2563eb'
  const hasZoom = !!integrations?.zoom;
  const hasGoogle = !!integrations?.google_meet;
  const hasAnyVideo = hasZoom || hasGoogle;

  // Initialize state based on existing booking data
  const [meetingType, setMeetingType] = useState<'in_person' | 'online'>(
    booking.meeting_link ? 'online' : 'in_person'
  );
  
  // Initialize provider based on current booking type or fallback to available
  const [provider, setProvider] = useState<'zoom' | 'google_meet'>(() => {
  // 1. If the existing booking already has a type, keep it
  if (booking.meeting_type === 'google_meet') return 'google_meet';
  if (booking.meeting_type === 'zoom') return 'zoom';
  
  // 2. If it's a new selection (no meeting_type yet), use what is available
  if (hasZoom) return 'zoom';
  if (hasGoogle) return 'google_meet';
  
  return 'zoom'; // Generic fallback
});
  const myTeamMembers = allPros.filter((p: { parent_id: any; role: string }) => {
    const pParentId = String(p.parent_id || "").trim().toLowerCase();
    const vId = String(viewer?.id || "").trim().toLowerCase();
    return pParentId === vId && p.role === 'teammember';
  });

  const hasTeam = isPro && myTeamMembers.length > 0;
  const isInitiallyTeam = booking.doctor_id !== viewer.id
  const [bookingTarget, setBookingTarget] = useState<'self' | 'team'>(isInitiallyTeam ? 'team' : 'self')
  
  const formattedDate = new Date(booking.start_time).toISOString().slice(0, 16)
  const updateBookingWithId = updateBooking.bind(null, id)

  return (
    <div className="space-y-8"> 
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
                Edit Booking
              </h1>
              <p className="text-slate-400 text-sm font-bold">
                Scheduling as <span className="text-slate-600">{viewer.first_name} {viewer.last_name}</span>
              </p>
            </div>
          </div>
        </header>
      <form action={updateBookingWithId} className="space-y-6 bg-white p-8 border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-blue-100/50">
        
        {/* 1. PROFESSIONAL SELECTOR (STAFF/CLIENT LOGIC) */}
      {isStaff && (
        <div className="space-y-3 p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
          <label className="text-[10px] uppercase font-black text-slate-400 ml-2 tracking-widest">Assign Booking To</label>
          {hasTeam ? (
            <>
              {/* Toggle only shows if there is actually a team to choose from */}
              <div className="p-1 bg-slate-100 rounded-2xl flex gap-1">
                <button
                  type="button"
                  onClick={() => setBookingTarget('self')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                    bookingTarget === 'self' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <User size={18} /> For Me
                </button>
                <button
                  type="button"
                  onClick={() => setBookingTarget('team')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                    bookingTarget === 'team' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Users size={18} /> For Team
                </button>
              </div>

              {bookingTarget === 'team' ? (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 ml-1">Assign to Specialist</label>
                  <select 
                    name="doctor_id" 
                    required 
                    defaultValue={booking.doctor_id}
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                  >
                    <option value="">Select team member...</option>
                    {myTeamMembers.map((member: any) => (
                      <option key={member.id} value={member.id}>
                        {member.first_name} {member.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <input type="hidden" name="doctor_id" value={viewer.id} />
              )}
            </>
          ) : (
            /* If NO team exists, or if viewer is a team member themselves, default to self */
            <div className="flex items-center gap-2 px-2 py-1">
              <User size={14} className="text-blue-600" />
              <span className="text-sm font-bold text-slate-700">
                {viewer.first_name} {viewer.last_name} (You)
              </span>
              <input type="hidden" name="doctor_id" value={viewer.id} />
            </div>
            
          )}
        </div>
      )}

        {isClient && (
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-400 ml-1">Select Professional</label>
            <select name="doctor_id" required defaultValue={booking.doctor_id} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700">
              {allPros.map((pro: any) => (
                <option key={pro.id} value={pro.id}>{pro.first_name} {pro.last_name}</option>
              ))}
            </select>
          </div>
        )}

        {/* 2. SERVICE TYPE */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-black text-slate-400 ml-1">Service Type</label>
          <select 
            name="event_type_id" 
            required 
            defaultValue={booking.event_type_id}
            className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {eventTypes?.map((type: any) => (
              <option key={type.id} value={type.id}>{type.title} ({type.duration} min.)</option>
            ))}
          </select>
        </div>

     
        {/* 4. CLIENT FIELD */}
        {isClient ? (
          <div className="p-5 bg-blue-50 border border-blue-100 rounded-[1.5rem] flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-xl text-white"><CheckCircle2 size={20} /></div>
            <div>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Booking as</p>
              <p className="font-bold text-blue-900">{viewer.first_name} {viewer.last_name}</p>
            </div>
            <input type="hidden" name="client_id" value={viewer.id} />
            <input type="hidden" name="guest_name" value={`${viewer.first_name} ${viewer.last_name}`} />
            <input type="hidden" name="guest_email" value={viewer.email} />
          </div>
        ) : (
          <ClientSelectorField 
            allClients={allClients} 
            initialClientId={booking.client_id}
            initialGuestName={booking.guest_name}
            initialGuestEmail={booking.guest_email}
            viewer={viewer}
          />
        )}

        {/* 5. DATE & TIME */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-black text-slate-400 ml-1">Schedule Date & Time</label>
          <input 
            name="start_time" 
            type="datetime-local" 
            defaultValue={formattedDate} 
            required 
            className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div> 
        {hasAnyVideo && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black text-slate-400 ml-2 tracking-widest">Location / Mode</label>
              <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                <button 
                  type="button"
                  onClick={() => setMeetingType('in_person')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                    meetingType === 'in_person' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500'
                  }`}
                >
                  <Users size={16} /> In-Person
                </button>
                <button
                  type="button"
                  onClick={() => setMeetingType('online')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                    meetingType === 'online' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500'
                  }`}
                >
                  <Video size={16} style={{ color: meetingType === 'online' ? brandColor : undefined }} /> Online Video
                </button>
              </div>
            </div>

            {meetingType === 'online' && (
              <div className="space-y-3 pt-2 animate-in zoom-in-95">
                <label className="text-[10px] uppercase font-black text-slate-400 ml-2 tracking-widest">Select Platform</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    disabled={!hasZoom}
                    onClick={() => setProvider('zoom')}
                    className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all relative ${
                      provider === 'zoom' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-400 grayscale opacity-50'
                    }`}
                  >
                    <Video size={16} />
                    <span className="font-bold text-sm">Zoom</span>
                    {!hasZoom && <span className="absolute -top-2 right-2 bg-slate-200 text-[8px] px-2 py-0.5 rounded-full text-slate-500 font-black italic">NOT LINKED</span>}
                  </button>

                  <button
                    type="button"
                    disabled={!hasGoogle}
                    onClick={() => setProvider('google_meet')}
                    className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all relative ${
                      provider === 'google_meet' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-white text-slate-400 grayscale opacity-50'
                    }`}
                  >
                    <Video size={16} />
                    <span className="font-bold text-sm">Google Meet</span>
                  </button>
                </div>
              </div>
            )}
            <input type="hidden" name="location_type" value={meetingType} />
            <input type="hidden" name="preferred_provider" value={provider} />
          </div>
        )} 
        
        {!hasAnyVideo && <input type="hidden" name="location_type" value="in_person" />}

        <button 
          style={{ backgroundColor: brandColor }} 
          type="submit" 
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-blue-600 transition-all active:scale-[0.98] shadow-xl"
        >
          Save Changes
        </button>
      </form>

      <div className="pt-6 flex justify-center">
        <DeleteBookingButton id={id} guestName={booking.guest_name} />
      </div>
    </div>
  )
}