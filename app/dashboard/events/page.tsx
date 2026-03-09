import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Clock, Plus, Settings, Share2, ExternalLink } from 'lucide-react'

export default async function EventsPage() {
  const supabase = await createClient()
  
  // 1. Auth Check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Fetch the data
  const { data: events, error } = await supabase
    .from('event_types')
    .select('*') 

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Meeting Types<span className="text-blue-600">.</span>
          </h1>
          <p className="text-slate-500 mt-1">Configure your services and booking durations.</p>
        </div>
        <Link 
          href="events/new" 
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={20} /> New Event Type
        </Link>
      </header>

      <div className="mt-8">
        {events && events.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="group relative bg-white p-8 border border-slate-100 rounded-[2.5rem] shadow-xl shadow-blue-100/30 hover:shadow-blue-200/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Clock size={24} />
                    </div>
                    <button className="text-slate-300 hover:text-slate-600 transition-colors">
                        <Settings size={18} />
                    </button>
                  </div>

                  <h3 className="font-black text-xl text-slate-900 mb-2">{event.title}</h3>
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-6">
                    <span className="bg-slate-100 px-3 py-1 rounded-full uppercase tracking-tighter text-[10px]">
                      {event.duration} Minutes
                    </span>
                    <span className="text-slate-200">•</span>
                    <span className="text-slate-400 font-normal">One-on-one</span>
                  </div>
                </div> 
              </div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="p-16 border-2 border-dashed border-slate-200 rounded-[3rem] text-center bg-slate-50/50">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <Settings size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">No event types found</h2>
            <p className="mb-8 text-slate-500 max-w-sm mx-auto">
              You need to define at least one service before clients can start booking appointments with you.
            </p> 
            <Link 
              href="/dashboard/new" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 font-black shadow-lg shadow-blue-100 transition-all active:scale-95" 
            >
              <Plus size={20} /> Create your first service
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}