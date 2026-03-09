import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Calendar, History, Mail, Phone, Info, ShieldCheck, Ban, Archive as ArchiveIcon } from "lucide-react";

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  // 1. Get the current viewer's info correctly
  const { data: { user: viewerSession } } = await supabase.auth.getUser();
  const { data: viewerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', viewerSession?.id) // Use session ID, not target ID
    .single();

  // 2. Fetch the Target Client's data (All Columns)
  const { data: targetClient } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (!targetClient) return notFound();

  // 3. Conditional Appointment Query
  let query = supabase
    .from('bookings')
    .select(`
      *,
      event_types(title, duration),
      doctor:profiles!bookings_doctor_id_fkey(username, first_name, last_name)
    `)
    .eq('client_id', targetClient.id)
    .order('start_time', { ascending: false });

  if (viewerProfile?.role === 'pro') {
    query = query.eq('doctor_id', viewerSession?.id);
  } 

  const { data: appointments } = await query;

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      {/* HEADER SECTION */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
        {/* Background Status Indicator for Admin */}
        {targetClient.is_blocked && (
          <div className="absolute top-0 right-0 bg-red-500 text-white px-6 py-2 rounded-bl-3xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
            <Ban size={14} /> Account Blocked
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          {/* Avatar */}
          <div className="w-28 h-28 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-slate-200">
            {targetClient.username?.[0].toUpperCase()}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                {targetClient.first_name} {targetClient.last_name}
              </h1>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                Client
              </span>
            </div>
            
            <p className="text-slate-500 font-medium mb-6">@{targetClient.username}</p>

            {/* QUICK STATS / INFO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                <Mail size={18} className="text-blue-500" />
                <span className="text-sm font-semibold truncate">{targetClient.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                <Phone size={18} className="text-blue-500" />
                <span className="text-sm font-semibold">{targetClient.phone || 'No phone recorded'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* BIO / DESCRIPTION SECTION */}
        {targetClient.bio && (
          <div className="mt-8 pt-8 border-t border-slate-50">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
              <Info size={14} /> Internal Notes / Bio
            </h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              {targetClient.bio}
            </p>
          </div>
        )}
      </div>

      {/* APPOINTMENT HISTORY */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <History size={24} className="text-blue-600" />
            Session History
          </h2>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-4 py-2 rounded-full">
            {appointments?.length || 0} Total Bookings
          </span>
        </div>

        <div className="grid gap-4">
          {appointments?.map((booking) => (
            <div 
              key={booking.id} 
              className="p-8 bg-white border border-slate-100 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center group hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300"
            >
              <div className="flex gap-6 items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Calendar size={28} />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                    {booking.event_types?.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-slate-500 font-bold">
                      {new Date(booking.start_time).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <p className="text-sm text-slate-400 font-medium">
                      {new Date(booking.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 text-center md:text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                  Assigned Professional
                </p>
                <div className="flex items-center justify-center md:justify-end gap-2">
                   {viewerProfile?.role === 'admin' && <ShieldCheck size={14} className="text-purple-500" />}
                   <p className="font-black text-slate-700">
                    {viewerSession?.id === booking.doctor_id ? 'You' : `Dr. ${booking.doctor?.last_name || booking.doctor?.username}`}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {appointments?.length === 0 && (
            <div className="p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-slate-200" />
              </div>
              <p className="text-slate-400 font-bold text-lg">No history found for this client.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}