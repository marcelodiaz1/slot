'use client'

import { useActionState, useState } from 'react'
import { handleCreateBooking } from './actions'
import { CheckCircle2, User, Users, Calendar, AlertCircle, Video } from 'lucide-react'

export function NewBookingForm({ 
  eventTypes, 
  username,
  viewer, 
  integrations,
  allClients = [],
  allPros = []
}: { 
  eventTypes: any[], 
  username: string,
  viewer?: any,
  integrations?: { zoom?: boolean, google_meet?: boolean },
  allClients?: any[],
  allPros?: any[]
}){
  interface ActionState {
  error: string | null;
  message?: string | null; // The '?' makes it optional, or just use string
  success?: boolean;
}
   const brandColor = viewer?.brand_color || '#2563eb';
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
  handleCreateBooking, 
  { error: null, message: null }
);
    const hasZoom = !!integrations?.zoom;
  const hasGoogle = !!integrations?.google_meet;
  const hasAnyVideo = hasZoom || hasGoogle;
  const hasOnlineIntegration = integrations?.zoom || integrations?.google_meet;
  const [meetingType, setMeetingType] = useState<'in_person' | 'online'>(
    hasOnlineIntegration ? 'online' : 'in_person'
  );
  
  const isClient = viewer?.role === 'client';
  const isPro = viewer?.role === 'pro';
  const isTeamMember = viewer?.role === 'teammember';
  const isStaff = viewer?.role === 'admin' || isPro || isTeamMember;
  const isAnonymous = !viewer || !viewer.role;
  const [provider, setProvider] = useState<'zoom' | 'google_meet'>(
    hasZoom ? 'zoom' : (hasGoogle ? 'google_meet' : 'zoom')
  );
  // --- CLIENT FILTERING LOGIC ---
  const filteredClients = allClients.filter((record, index, self) => {
    const recordDoctorId = String(record.doctor_id || "").toLowerCase().trim();
    const vId = String(viewer?.id || "").toLowerCase().trim();
    const vParentId = String(viewer?.parent_id || "").toLowerCase().trim();

    let isMatch = false;
    if (viewer?.role === 'admin') isMatch = true;
    else if (isPro) isMatch = recordDoctorId === vId;
    else if (isTeamMember) isMatch = recordDoctorId === vParentId;

    if (isMatch) {
      return self.findIndex(r => String(r.client_id) === String(record.client_id)) === index;
    }
    return false;
  }).map(record => ({
      id: record.client_id,
      first_name: record.guest_name?.split(' ')[0] || "Client",
      last_name: record.guest_name?.split(' ').slice(1).join(' ') || "",
      email: record.guest_email || ""
  }));

  const myTeamMembers = allPros.filter(p => {
    const pParentId = String(p.parent_id || "").trim().toLowerCase();
    const vId = String(viewer?.id || "").trim().toLowerCase();
    return pParentId === vId && p.role === 'teammember';
  });

  const hasTeam = isPro && myTeamMembers.length > 0;

  // --- STATE ---
  const [isManualEntry, setIsManualEntry] = useState(!isStaff && !isClient);
  const [selectedClientId, setSelectedClientId] = useState(isClient ? viewer.id : "");
  const [bookingTarget, setBookingTarget] = useState<'self' | 'team'>('self');
  
  const isFixedEvent = eventTypes.length === 1;
  const defaultEventId = isFixedEvent ? eventTypes[0].id : "";

  return (
    <form action={formAction} className="space-y-6 bg-white p-8 border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-blue-100/50">
      {state?.error === 'conflict' && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm font-bold">{state.message}</p>
        </div>
      )}

      {/* Other generic errors */}
      {state?.error && state.error !== 'conflict' && (
         <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700 text-sm font-bold">
           {state.message || "An unexpected error occurred."}
         </div>
      )}
      {/* 1. ASSIGNMENT LOGIC (WHO IS THE DOCTOR?) */}
      {isStaff && (
        <div className="space-y-3 p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
          <label className="text-[10px] uppercase font-black text-slate-400 ml-2 tracking-widest">Assign Booking To</label>
          
          {hasTeam ? (
            <>
              <div className="flex gap-2">
                <button 
                  style={{ backgroundColor: brandColor , color:'white'}} 
                  type="button"
                  onClick={() => setBookingTarget('self')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all hover:opacity-90  ${bookingTarget === 'self' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
                >
                  Myself
                </button>
                <button
                  style={{ backgroundColor: brandColor, color:'white' }} 
                  type="button"
                  onClick={() => setBookingTarget('team')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all hover:opacity-90  ${bookingTarget === 'team' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
                >
                  Team Member
                </button>
              </div>

              {bookingTarget === 'team' ? (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                  <select name="username" required className="w-full p-4 bg-white border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 shadow-sm">
                    <option value="">Select team member...</option>
                    {myTeamMembers.map((member) => (
                      <option key={member.id} value={member.username}>{member.first_name} {member.last_name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <input type="hidden" name="username" value={viewer.username} />
              )}
              
              {/* 2. MEETING TYPE */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-slate-400 ml-1">Meeting Type</label>
                <select name="event_type_id" required defaultValue={defaultEventId} className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700">
                  <option value="">Select a service...</option>
                  {eventTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.title} ({type.duration} min)</option>
                  ))}
                </select>
              </div>

            </>
          ) : (
            /* If no team or is TeamMember, default to self */
            <div className="flex items-center gap-2 px-2 py-1">
               <User size={14} className="text-blue-600" />
               <span className="text-sm font-bold text-slate-700">{viewer.first_name} {viewer.last_name} (You)</span>
               <input type="hidden" name="username" value={viewer.username} />
            </div>
          )}
        </div>
      )}

      {/* 3. CLIENT SELECTION (WHO IS THE PATIENT?) */}
      <div className="space-y-4">
        {isStaff ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase font-bold text-slate-400 ml-1">Client Selection</label> 
            </div>

              
              <div className="space-y-4">
                <select 
                  name="client_id" 
                  required 
                  value={selectedClientId} 
                  onChange={(e) => setSelectedClientId(e.target.value)} 
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700"
                >
                  <option value="">Choose a registered client...</option>
                  {filteredClients.map((c) => (
                    <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                  ))}
                </select>
                
                {selectedClientId && (
                  <>
                    {(() => {
                      const c = filteredClients.find(u => String(u.id) === String(selectedClientId));
                      return (
                        <>
                          <input type="hidden" name="guest_name" value={`${c?.first_name || ""} ${c?.last_name || ""}`} />
                          <input type="hidden" name="guest_email" value={c?.email || ""} />
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
          
          </div>
        ) : isClient ? (
          <div className="p-5 bg-blue-50 border border-blue-100 rounded-[1.5rem] flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-xl text-white"><CheckCircle2 size={20} /></div>
            <div>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Booking as</p>
              <p className="font-bold text-blue-900">{viewer.first_name} {viewer.last_name}</p>
            </div>
            <input type="hidden" name="client_id" value={viewer.id || ""} />
            <input type="hidden" name="guest_name" value={`${viewer.first_name || ""} ${viewer.last_name || ""}`} />
            <input type="hidden" name="guest_email" value={viewer.email || ""} />
          </div>
        ) : (
          <div className="space-y-4">
            <label className="text-xs uppercase font-bold text-slate-400 ml-1">Your Information</label>
            <div className="grid gap-4">
              <input name="guest_name" type="text" required placeholder="Full Name" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold" /> 
              <input name="guest_email" type="email" required placeholder="Email Address" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold" />
            </div>
          </div>
        )}
      </div>
   

 
      {/* 4. PROFESSIONAL SELECTION (ONLY FOR CLIENTS) */}
      {isClient && (
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-slate-400 ml-1">Select Professional</label>
          <select 
            name="username" 
            required 
            className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
          >
            <option value="">Choose a professional...</option>
            {allPros.map((pro) => (
              <option key={pro.id} value={pro.username}>
                {pro.first_name} {pro.last_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 5. ANONYMOUS FALLBACK */}
      {isAnonymous && <input type="hidden" name="username" value={username} />}

      {/* 6. DATE & TIME */}
      <div className="space-y-2">
        <label className="text-xs uppercase font-bold text-slate-400 ml-1">Date & Time</label>
        <div className="relative">
          <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input name="start_time" type="datetime-local" required className="w-full p-4 pl-12 bg-slate-50 border-none rounded-2xl font-bold text-slate-700" />
        </div>
      </div>

{/* Only show the "Location / Mode" section if at least one video provider is connected */}
{hasAnyVideo && (
  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
    <div className="space-y-3">
      <label className="text-[10px] uppercase font-black text-slate-400 ml-2 tracking-widest">
        Location / Mode
      </label>
      <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
        <button 
          type="button"
          onClick={() => setMeetingType('in_person')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
            meetingType === 'in_person' 
            ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
            : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users size={16} />
          In-Person
        </button>
        <button
          type="button"
          onClick={() => setMeetingType('online')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
            meetingType === 'online' 
            ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
            : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Video size={16} style={{ color: meetingType === 'online' ? brandColor : undefined }} />
          Online Video
        </button>
      </div>
    </div>

    {/* Platform Selection - Only appears when "Online" is selected */}
    {meetingType === 'online' && (
      <div className="space-y-3 pt-2 animate-in zoom-in-95 duration-300">
        <label className="text-[10px] uppercase font-black text-slate-400 ml-2 tracking-widest">
          Select Platform
        </label>
        <div className="flex gap-4">
          {/* Zoom Button */}
          <button
            type="button"
            disabled={!hasZoom}
            onClick={() => setProvider('zoom')}
            className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all relative ${
              provider === 'zoom' 
              ? 'border-blue-600 bg-blue-50 text-blue-700' 
              : 'border-slate-100 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed disabled:hover:bg-white'
            }`}
          >
            <Video size={16} />
            <span className="font-bold text-sm">Zoom</span>
            {!hasZoom && <span className="absolute -top-2 right-2 bg-slate-200 text-[8px] px-2 py-0.5 rounded-full text-slate-500 font-black italic">NOT LINKED</span>}
          </button>

          {/* Google Meet Button */}
          <button
            type="button"
            disabled={!hasGoogle}
            onClick={() => setProvider('google_meet')}
            className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all relative ${
              provider === 'google_meet' 
              ? 'border-emerald-600 bg-emerald-50 text-emerald-700' 
              : 'border-slate-100 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed disabled:hover:bg-white'
            }`}
          >
            <Video size={16} />
            <span className="font-bold text-sm">Google Meet</span>
            {!hasGoogle && <span className="absolute -top-2 right-2 bg-slate-200 text-[8px] px-2 py-0.5 rounded-full text-slate-500 font-black italic">NOT LINKED</span>}
          </button>
        </div>
      </div>
    )}

    {/* Hidden inputs to send data to the Server Action */}
    <input type="hidden" name="location_type" value={meetingType} />
    <input type="hidden" name="preferred_provider" value={provider} />
  </div>
)}
      <button  
          style={{ backgroundColor: brandColor }} 
        disabled={isPending} 
        className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black hover:bg-blue-700 disabled:opacity-50 transition active:scale-95 shadow-xl shadow-blue-100"
      >
        {isPending ? 'Processing...' : 'Confirm Session'}
      </button>

       
    </form>
  )
}