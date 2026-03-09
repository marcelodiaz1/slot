import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Lock, EyeOff, ChevronRight, ShieldCheck, Mail, Phone } from 'lucide-react'

// 1. Loading Skeleton
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto animate-pulse">
        <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-4" />
        <div className="h-8 bg-slate-200 w-48 mx-auto mb-4 rounded-xl" />
        <div className="space-y-4 mt-10">
          <div className="h-28 bg-slate-200 rounded-[2rem]" />
          <div className="h-28 bg-slate-200 rounded-[2rem]" />
        </div>
      </div>
    </div>
  )
}

// 2. Main Content
async function ProfileContent({ paramsPromise }: { paramsPromise: Promise<{ username: string }> }) {
  const { username } = await paramsPromise
  const supabase = await createClient()
  
  const { data: pro } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!pro || pro.is_blocked || pro.is_archived) return notFound();
  if (pro.role === 'client') return <PrivateProfileLanding username={pro.username} />;
  const { data: { user } } = await supabase.auth.getUser()
  const isAnonymous = !user
  const { data: events } = await supabase
    .from('event_types')
    .select('*')
    .or(`user_id.eq.${pro.id},user_id.is.null`) 
    .order('duration', { ascending: true })

  // Define brand color and safe text color
  const brandColor = pro.brand_color || '#2563eb'

  return (
    <div 
      className="min-h-screen w-full bg-slate-50/50"
      style={{ '--brand-accent': brandColor } as React.CSSProperties}
    > 
      <main className="max-w-6xl mx-auto pt-32 pb-20 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: Profile & Contact Card */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm overflow-hidden relative">
              {/* Branding Accent Bar */}
              <div className="absolute top-0 left-0 w-full h-2 bg-[var(--brand-accent)]" />              
              <div className="relative z-10">
                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl ring-1 ring-slate-100 p-2 mb-6">
                  {pro.logo_url ? (
                    <img src={pro.logo_url} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white text-3xl font-black">
                      {pro.username[0].toUpperCase()}
                    </div>
                  )}
                </div>

                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {pro.first_name ? `${pro.first_name} ${pro.last_name}` : `@${pro.username}`}
                </h1>
                <p className="text-[var(--brand-accent)] font-bold text-sm tracking-widest uppercase mt-1">
                  Professional Profile
                </p>

                {pro.bio && (
                  <p className="mt-6 text-slate-600 leading-relaxed font-medium">
                    {pro.bio}
                  </p>
                )}

                <div className="mt-8 space-y-4 pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-4 text-slate-600">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Address</p>
                      <p className="text-sm font-bold text-slate-700">{pro.email || 'Contact via message'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-slate-600">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone Number</p>
                      <p className="text-sm font-bold text-slate-700">{pro.phone || 'Private'}</p>
                    </div>
                  </div>
                </div>
                {pro.email ? (
                  <a 
                    href={`mailto:${pro.email}?subject=Inquiry from Slot Booking Profile`}
                    className="block w-full text-center mt-8 py-4 border-2 border-[var(--brand-accent)] text-[var(--brand-accent)] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[var(--brand-accent)] hover:text-white transition-all"
                  >
                    Send a Message
                  </a>
                ) : (
                  <button 
                    disabled
                    className="w-full mt-8 py-4 border-2 border-slate-200 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs cursor-not-allowed"
                  >
                    Messaging Unavailable
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              Encrypted Booking Protocol
            </p>
          </div>

          {/* RIGHT COLUMN: Event Types List */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 px-2">
              Available Services
            </h3>
            
           {events?.map((event: any) => {
              // 2. Logic: If anonymous, send to login with a redirect back
              const bookingUrl = `/${pro.username}/${event.slug}/${event.id}`
              const loginUrl = `/auth/sign-up`
              
              return (
                <Link 
                  key={event.id}
                  href={isAnonymous ? loginUrl : bookingUrl}
                  className="group block p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:border-[var(--brand-accent)] hover:shadow-2xl hover:shadow-[var(--brand-accent)]/5 transition-all relative overflow-hidden"
                >
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <h2 className="text-xl font-black text-slate-800 group-hover:text-[var(--brand-accent)] transition-colors">
                        {event.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-2 text-slate-400 font-medium">
                        <Clock size={16} />
                        <span>{event.duration} minutes session</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-[var(--brand-accent)] font-black text-sm uppercase tracking-widest bg-slate-50 px-5 py-2.5 rounded-2xl group-hover:bg-[var(--brand-accent)] group-hover:text-white transition-all">
                      {isAnonymous ? (
                        <>
                          Login to Book
                          <Lock size={16} className="ml-1" />
                        </>
                      ) : (
                        <>
                          Select
                          <ChevronRight size={16} />
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Visual hint for anonymous users */}
                  {isAnonymous && (
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Lock size={80} />
                    </div>
                  )}
                </Link>
              )
            })}

            {(!events || events.length === 0) && (
              <div className="text-center p-12 bg-slate-100/50 rounded-[2.5rem] border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">No services currently available for booking.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}


export default function UserProfilePage(props: { 
  params: Promise<{ username: string }> 
}) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent paramsPromise={props.params} />
    </Suspense>
  )
}

function PrivateProfileLanding({ username }: { username: string }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full">
        {/* Security Shield Icon */}
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-pulse">
          <ShieldCheck size={40} strokeWidth={2.5} />
        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
          This Profile is Encrypted
        </h1>
        
        <p className="text-slate-500 font-medium leading-relaxed mb-10">
          You are trying to access <span className="text-slate-900 font-bold">@{username}</span>. 
          To protect our users' medical and personal data, client profiles are never visible to the public.
        </p>

        {/* Value Proposition Cards */}
        <div className="grid gap-3 mb-10 text-left">
          <div className="p-4 bg-slate-50 rounded-2xl flex items-start gap-3 border border-slate-100">
            <div className="mt-1 text-blue-600"><Lock size={16} /></div>
            <p className="text-sm text-slate-600">Only authorized professionals can view this history.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl flex items-start gap-3 border border-slate-100">
            <div className="mt-1 text-blue-600"><EyeOff size={16} /></div>
            <p className="text-sm text-slate-600">Activity is hidden from search engines and guests.</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-4">
          <Link 
            href="/auth/sign-up" 
            className="block w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
          >
            Create your secure account
          </Link>
          <Link 
            href="/auth/login" 
            className="block w-full py-4 text-slate-500 font-bold hover:text-slate-800 transition-colors"
          >
            Already have an account? Sign In
          </Link>
        </div>

        <p className="mt-12 text-[10px] uppercase tracking-widest text-slate-300 font-bold">
          Slot Security Protocol v2.6
        </p>
      </div>
    </div>
  );
}