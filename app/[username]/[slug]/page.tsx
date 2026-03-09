import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation' 
import { NewBookingForm } from '@/app/dashboard/bookings/new/NewBookingForm'

// 1. The main page component - NO 'await' here!
export default function BookingPage({ params }: { params: Promise<{ username: string, slug: string }> }) {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      {/* 2. Pass the params promise down into the Suspense boundary */}
      <Suspense fallback={<div className="animate-pulse text-center">Loading event details...</div>}>
        <EventDetails paramsPromise={params} />
      </Suspense>
    </div>
  )
}

// 3. The data-fetching component - 'await' happens safely here
async function EventDetails({ paramsPromise }: { paramsPromise: Promise<{ username: string, slug: string }> }) {
  const { slug } = await paramsPromise
  
  const { username } = await paramsPromise
  const supabase = await createClient()
   
  const { data: event, error } = await supabase
    .from('event_types')
    .select('*, user_id') // Ensure we get the user_id (the doctor)
    .eq('slug', slug)
    .single()

  if (error || !event) return notFound()

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-600 mb-8">{event.duration} minutes</p>
       
      <NewBookingForm 
        eventTypes={[event]}  username={username}
      />
    </div>
  )
}