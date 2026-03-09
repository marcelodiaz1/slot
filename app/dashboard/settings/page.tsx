import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SettingsForm from './SettingsForm'

export default async function SettingsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500 font-medium">Manage your identity and platform preferences.</p>
      </header>

      <Suspense fallback={<div className="h-96 w-full bg-slate-50 animate-pulse rounded-[2.5rem] border border-slate-100" />}>
        <SettingsContent />
      </Suspense>
    </div>
  )
}

async function SettingsContent() {
  const supabase = await createClient()
  
  // 1. Get the Auth User
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    console.error("AUTH ERROR:", authError)
    redirect('/login')
  }

  console.log("SEARCHING FOR PROFILE WITH ID:", user.id)

  // 2. Search the profiles table where the column 'id' matches user.id
  const { data: profile, error: dbError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id) 
    .single()

  // 3. LOG THE RESULT TO YOUR TERMINAL
  if (dbError) {
    console.error("DATABASE SEARCH FAILED:", dbError.message)
    console.error("DETAILS:", dbError.details)
  } else {
    console.log("SUCCESS: Profile found for:", profile.first_name)
  }

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden">
      <SettingsForm 
        key={profile?.id || 'no-data'} 
        initialData={profile} 
        userEmail={user.email} 
      />
    </div>
  )
}