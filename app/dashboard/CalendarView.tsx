'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Users, Globe } from "lucide-react"
import { createClient } from '@/lib/supabase/client'

interface CalendarProps {
  initialBookings: any[];
  initialData: any;
  viewer: any;
}

export function CalendarView({ initialData, initialBookings, viewer }: CalendarProps) {
  const [mounted, setMounted] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [googleEvents, setGoogleEvents] = useState<any[]>([]) 
  const brandColor = initialData?.brand_color || '#2563eb'

  useEffect(() => {
    setMounted(true)
    // DEBUG 1: Check what the server sent us
    console.log("🚀 CALENDAR MOUNTED. Viewer Role:", viewer?.role);
    console.log("📦 INITIAL BOOKINGS SAMPLE:", initialBookings?.[0]);

    if (initialData?.integrations?.google_calendar) {
      fetchGoogleCalendarEvents()
    }
  }, [currentDate, initialData])

  const fetchGoogleCalendarEvents = async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.provider_token
    if (!token) return
    try {
      const timeMin = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString()
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&singleEvents=true&orderBy=startTime`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await response.json()
      if (data.items) setGoogleEvents(data.items)
    } catch (error) {
      console.error("Error fetching Google Events:", error)
    }
  }

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1))
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  
  const paddingDays = Array.from({ length: firstDayOfMonth })
  const monthDays = Array.from({ length: daysInMonth })

  // --- DATA PROCESSING ---
  const eventsByDay = [...initialBookings, ...googleEvents].reduce((acc: any, item) => {
    const dateStr = item.start_time || item.start?.dateTime || item.start?.date
    if (!dateStr) return acc

    const bDate = new Date(dateStr)
    if (bDate.getFullYear() === year && bDate.getMonth() === month) {
      const day = bDate.getDate()
      if (!acc[day]) acc[day] = []
      
      const isGoogle = !!item.etag;
      
      // Determine if we should show the "With [Pro Name]" line
      const isTeamBooking = !isGoogle && (
        (viewer?.role === 'pro' && item.doctor_id !== viewer?.id) || 
        (viewer?.role === 'client') ||
        (viewer?.role === 'teammember')
      );
      
      acc[day].push({ 
        ...item, 
        isGoogle, 
        isTeamBooking,  
        sortDate: bDate 
      });
    }
    return acc
  }, {})

  Object.keys(eventsByDay).forEach(day => {
    eventsByDay[day].sort((a: any, b: any) => a.sortDate - b.sortDate)
  })

  const monthName = currentDate.toLocaleString('en-US', { month: 'long' })

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <CalendarIcon style={{ color: brandColor }} size={36} />
            {monthName} <span style={{ color: brandColor }}>{year}</span>
          </h1>
          <div className="flex items-center gap-4 mt-2">
             <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft /></button>
             <button onClick={() => setCurrentDate(new Date())} className="text-xs font-bold uppercase tracking-widest" style={{ color: brandColor }}>Today</button>
             <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronRight /></button>
          </div>
        </div>
        
        <Link href="/dashboard/bookings/new" style={{ backgroundColor: brandColor }} className="text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all active:scale-95">
          <Plus size={20} /> New Appointment
        </Link>
      </header>

      <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-5 text-center text-[11px] font-black uppercase text-slate-400 tracking-widest">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-[160px]">
          {paddingDays.map((_, i) => (
            <div key={`pad-${i}`} className="border-r border-b border-slate-50 bg-slate-50/10" />
          ))}

          {monthDays.map((_, i) => {
            const day = i + 1
            const dayEvents = eventsByDay[day] || []
            const isToday = mounted && new Date().toDateString() === new Date(year, month, day).toDateString();

            return (
              <div key={day} className="border-r border-b border-slate-50 p-3 hover:bg-slate-50/50 overflow-y-auto group transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-black transition-all ${isToday ? 'px-2 py-1 rounded-lg text-white shadow-md' : 'text-slate-300'}`} style={isToday ? { backgroundColor: brandColor } : {}}>
                    {day.toString().padStart(2, '0')}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {dayEvents.map((item: any) => {
                    const startDate = new Date(item.start_time || item.start?.dateTime || item.sortDate);
                    const timeStart = mounted ? startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--";
                    
                    const durationMinutes = item.event_types?.duration || 30;
                    const endDate = item.isGoogle 
                      ? new Date(item.end?.dateTime || item.end?.date) 
                      : new Date(startDate.getTime() + durationMinutes * 60000);
                    
                    const timeEnd = mounted ? endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--";

                    if (item.isGoogle) {
                      return (
                        <div key={item.id} className="p-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 relative overflow-hidden">
                          <Globe size={10} className="absolute top-1 right-1 text-slate-300" />
                          <div className="text-[10px] font-black mb-1 text-slate-400">{timeStart} - {timeEnd}</div>
                          <div className="text-[10px] font-bold truncate text-slate-500">{item.summary || '(No Title)'}</div>
                        </div>
                      )
                    }

                    // DEBUG 2: Log every time a team booking is rendered to see if doctor object exists
                    if (item.isTeamBooking) {
                       console.log(`🔍 DEBUG [Booking ${item.id}]: doctor object ->`, item.doctor);
                    }

                    return (
                      <Link 
                        href={`/dashboard/bookings/${item.id}`} 
                        key={item.id} 
                        className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm block hover:shadow-md transition-all relative overflow-hidden"
                        style={{ borderLeft: `3px solid ${brandColor}` }}
                      >
                        <div className="text-[9px] font-black mb-1 text-slate-400">
                          {timeStart} <span className="text-slate-200 mx-0.5">•</span> {timeEnd}
                        </div>

                        <div className="text-[10px] font-bold truncate text-slate-700 capitalize">
                          {viewer?.role === 'client' 
                            ? (item.event_types?.title || 'Appointment') 
                            : item.guest_name
                          }
                        </div>

                        {item.isTeamBooking && (
                          <div className="text-[8px] text-slate-500 font-black uppercase mt-1 truncate flex items-center gap-1">
                            <span className="text-slate-300 font-medium">w/</span> 
                            <span className="text-blue-600">
                              {/* If item.doctor is undefined, this will show 'Professional' */}
                              {item.doctor?.first_name 
                                ? `${item.doctor.first_name} ${item.doctor.last_name || ''}` 
                                : (item.doctor?.username || 'Professional')}
                            </span>
                          </div>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}