import { createClient } from '@/utils/supabase/server'

export async function getAvailableSlots(userId: string, date: Date, durationInMinutes: number) {
  const supabase = await createClient()
  const dayOfWeek = date.getDay() // 0-6

  // 1. Get User's Base Availability for this specific day
  const { data: availability } = await supabase
    .from('availability')
    .select('*')
    .eq('user_id', userId)
    .eq('day_of_week', dayOfWeek)
    .single()

  if (!availability) return [] // Not working this day

  // 2. Get existing bookings for this day to avoid double-booking
  const startOfDay = new Date(date.setHours(0, 0, 0, 0)).toISOString()
  const endOfDay = new Date(date.setHours(23, 59, 59, 999)).toISOString()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('start_time')
    .eq('event_type_id', '...your_logic_here...') // We'll refine this
    .gte('start_time', startOfDay)
    .lte('start_time', endOfDay)

  // 3. Generate Slots
  const slots = []
  let currentSlot = new Date(`${date.toISOString().split('T')[0]}T${availability.start_time}`)
  const endTime = new Date(`${date.toISOString().split('T')[0]}T${availability.end_time}`)

  while (currentSlot < endTime) {
    const timeString = currentSlot.toTimeString().slice(0, 5) // "09:00"
    
    // Check if this slot is already booked
    const isBooked = bookings?.some(b => 
      new Date(b.start_time).toTimeString().slice(0, 5) === timeString
    )

    if (!isBooked) {
      slots.push(timeString)
    }

    // Move to the next slot based on duration
    currentSlot.setMinutes(currentSlot.getMinutes() + durationInMinutes)
  }

  return slots
}