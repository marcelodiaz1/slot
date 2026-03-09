import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import BookingCalendar from './BookingCalendar'
import Link from 'next/link'
import { NewBookingForm } from '@/app/dashboard/bookings/new/NewBookingForm'

// 1. Skeleton para carga
function BookingPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 animate-pulse h-[600px] shadow-xl" />
    </div>
  )
}

// 2. Contenido Real
async function BookingPageContent({ paramsPromise }: { paramsPromise: Promise<{ username: string; event_type_id: string }> }) {
  const { username, event_type_id } = await paramsPromise
  const supabase = await createClient()

  // 1. Buscamos al doctor por username
  const { data: profile } = await supabase
    .from('profiles')
    .select('id,  username')
    .eq('username', username)
    .single();

  if (!profile) return notFound()

  // 2. Buscamos el evento usando el nombre exacto del parámetro: event_type_id
  const { data: eventType } = await supabase 
    .from('event_types')
    .select('*')
    .eq('id', event_type_id)
    .single();

  if (!eventType) return notFound()

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <div>         
        <div className="w-full p-8 w-full border-b border-gray-100 bg-gray-50/50 text-center relative">
          <Link 
            href={`/${username}`} 
            className="absolute left-8 top-8 text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-sm font-medium group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          
          <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {profile.username[0]}
          </div>
          
          <h1 className="text-xl font-bold text-gray-900">{eventType.title}</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">con {profile.username}</p> 
          
          <div className="flex items-center justify-center text-gray-600 gap-2 mt-4">
             <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
               {eventType.duration} minutos
             </span>
          </div>
        </div>

        <div className="w-full p-8">
        
              <NewBookingForm eventTypes={[eventType]} username={username}  />
        </div>
      </div>
    </div>
  )
}

// 3. Punto de entrada (Asegúrate de que el nombre coincida)
export default function PublicBookingPage({ params }: { params: Promise<{ username: string; event_type_id: string }> }) {
  return (
    <Suspense fallback={<BookingPageSkeleton />}>
      <BookingPageContent paramsPromise={params} />
    </Suspense>
  )
}