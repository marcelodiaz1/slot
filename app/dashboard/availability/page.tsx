import { createClient } from '@/utils/supabase/server'
import { Suspense } from 'react'
import AvailabilityForm from './AvailabilityForm'

export default function AvailabilityPage() {
  return (
    <div className="p-8 max-w-3xl">

      <Suspense fallback={<div className="animate-pulse bg-slate-100 h-96 rounded-[2.5rem]" />}>
        <AvailabilityContent />
      </Suspense>
    </div>
  )
}

async function AvailabilityContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // 1. Fetch Availability data
  const { data: availability } = await supabase
    .from('availability')
    .select('*')
    .eq('user_id', user?.id)

  // 2. Fetch Profile for branding
  const { data: profile } = await supabase
    .from('profiles')
    .select('brand_color')
    .eq('id', user?.id)
    .single()

  // 3. Pass both to the form
  return (
    <AvailabilityForm 
      initialData={availability || []} 
      brandColor={profile?.brand_color || '#2563eb'} 
    />
  )
}