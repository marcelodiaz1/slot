import { createClient } from "@/lib/supabase/server";
import { Calendar as CalendarIcon, User } from "lucide-react";

export default async function CalendarPage() {
  const supabase = await createClient();

  // Traemos las citas y los datos del doctor asociado
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      profiles:doctor_id (username)
    `)
    .order('start_time', { ascending: true });

  // Agrupamos citas por día para facilitar el renderizado
  const bookingsByDay = bookings?.reduce((acc: any, booking) => {
    const day = new Date(booking.start_time).getDate();
    if (!acc[day]) acc[day] = [];
    acc[day].push(booking);
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
          <CalendarIcon className="text-blue-600" size={32} />
          Agenda Central
        </h1>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-xl overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
            <div key={d} className="py-4 text-center text-[10px] font-black uppercase text-gray-400 tracking-widest">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-[140px]">
          {Array.from({ length: 31 }).map((_, i) => {
            const day = i + 1;
            const dayBookings = bookingsByDay?.[day] || [];

            return (
              <div key={i} className="border-r border-b border-gray-50 p-2 hover:bg-gray-50/50 transition-all overflow-y-auto">
                <span className="text-xs font-bold text-gray-300">{day}</span>
                
                <div className="flex flex-col gap-1 mt-1">
                  {dayBookings.map((b: any) => (
                    <div key={b.id} className="p-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                      <div className="text-[9px] font-black leading-tight truncate">
                        {new Date(b.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </div>
                      <div className="text-[9px] font-medium truncate flex items-center gap-1">
                        <User size={8} /> {b.profiles?.username?.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}