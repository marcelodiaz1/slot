'use client'

import { bookSlot } from "@/app/actions"

export default function BookingForm({ eventId }: { eventId: string }) {
  return (
    <div className="mt-8 p-6 border rounded-2xl bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">Confirm Your Booking</h2>
      
      <form action={bookSlot} className="space-y-4">
        {/* CRITICAL: This hidden input fixes the "Cannot read properties of null" error */}
        <input type="hidden" name="eventId" value={eventId} />
        
        {/* For now, we'll hardcode a time until your calendar is linked */}
        <input type="hidden" name="startTime" value={new Date().toISOString()} />

        <div>
          <label className="block text-sm font-medium mb-1">Your Name</label>
          <input 
            name="guestName" 
            placeholder="John Doe" 
            className="w-full p-2 border rounded-lg" 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Your Email</label>
          <input 
            name="guestEmail" 
            type="email" 
            placeholder="john@example.com" 
            className="w-full p-2 border rounded-lg" 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-black text-white p-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
        >
          Book Appointment
        </button>
      </form>
    </div>
  )
}