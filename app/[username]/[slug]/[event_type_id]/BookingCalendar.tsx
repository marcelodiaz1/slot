'use client'

import { useState, useTransition } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { format } from 'date-fns'
import { getAvailableSlotsAction, confirmBooking } from '@/app/dashboard/actions'

interface Props {
  userId: string
  eventTypeId: string
  duration: number
}

export default function BookingCalendar({ userId, eventTypeId, duration }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [slots, setSlots] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  // 1. Handle Date Selection & Fetch real slots
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    setSelectedDate(date)
    setSelectedTime(null) // Reset time if date changes

    startTransition(async () => {
      const available = await getAvailableSlotsAction(userId, date.toISOString(), duration)
      setSlots(available)
    })
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* LEFT: CALENDAR PICKER */}
      <div className="calendar-container border rounded-2xl p-4 bg-white shadow-sm h-fit">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={{ before: new Date() }}
          modifiersStyles={{
            selected: { backgroundColor: '#2563eb', color: 'white' }
          }}
        />
      </div>

      {/* RIGHT: TIME SLOTS & GUEST FORM */}
      <div className="flex-1">        
        <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto px-2">
          {isPending ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : selectedTime ? (
            /* THE GUEST FORM (Shows when a time is clicked) */
            <div className="border-2 border-blue-600 rounded-2xl p-6 bg-blue-50 animate-in fade-in zoom-in duration-200 shadow-inner">
              <div className="text-center mb-4">
                <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider">Confirm Meeting</p>
                <h3 className="font-bold text-gray-700 mb-4 px-2 text-center">
                  {selectedDate ? format(selectedDate, 'EEEE, MMMM do') : 'Select a date'} | {selectedTime}
                </h3> 
              </div>

              <form action={confirmBooking} className="space-y-4">
                {/* Hidden Data for the Server Action */}
                <input type="hidden" name="eventTypeId" value={eventTypeId} />
                <input type="hidden" name="startTime" value={`${format(selectedDate!, 'yyyy-MM-dd')}T${selectedTime}:00`} />
                
                <div>
                  <label className="text-xs font-bold text-gray-500 ml-1">YOUR NAME</label>
                  <input 
                    name="guestName" 
                    placeholder="Jane Doe" 
                    required 
                    className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-gray-500 ml-1">EMAIL ADDRESS</label>
                  <input 
                    name="guestEmail" 
                    type="email" 
                    placeholder="jane@example.com" 
                    required 
                    className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                
                <div className="flex flex-col gap-2 pt-2">
                  <button 
                    type="submit" 
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Confirm Booking
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setSelectedTime(null)}
                    className="w-full py-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ← Back to times
                  </button>
                </div>
              </form>
            </div>
          ) : slots.length > 0 ? (
            /* THE TIME SLOTS LIST */
            slots.map(slot => (
              <button 
                key={slot} 
                onClick={() => setSelectedTime(slot)}
                className="w-full py-4 border-2 border-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm bg-white"
              >
                {slot}
              </button>
            ))
          ) : selectedDate ? (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
               <p className="text-gray-400 text-sm  ">No slots available for this date.</p>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-300 border-2 border-dashed rounded-2xl">
              <p>Pick a date on the left to start.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}