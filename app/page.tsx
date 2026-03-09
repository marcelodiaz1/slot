import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button' 
import { 
  Sparkles, 
  Zap, 
  UserCheck, 
  CheckCircle, 
  Clock, 
  CalendarCheck, 
  Link as LinkIcon, 
  Users, 
  Star, 
  MousePointerClick 
} from 'lucide-react';
import AnimatedFeatures from '@/components/AnimatedFeatures'
import  Hero  from '@/components/hero';

const getRandomAvatar = (seed: string) => `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0d80d2,51a37a,f9d073,f08705&backgroundType=gradientLinear&radius=50`

export default function LandingPage() {
  return (
    <section>      
        <Hero/>
        <div className="min-h-screen bg-white text-slate-900"> 
          <section className="relative overflow-hidden max-w-7xl mx-auto pt-20 pb-24 px-6 text-center">
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(ellipse at center, #E0F2F7 0%, transparent 70%)' }} />    
            <AnimatedFeatures />
          </section>

          {/* 2. CORE BENEFITS */}
          <section id="features" className="max-w-5xl mx-auto px-6 py-20 bg-gradient-to-br from-white to-blue-50 rounded-[3rem] shadow-inner-lg shadow-blue-50/50">
            <h2 className="text-4xl font-black text-center mb-16 tracking-tight">Built for Every Kind of Hustle</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
              {/* For Creators */}
              <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7 text-blue-700" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-xl">For Creators & Coaches</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  Sell your time without the overhead. Set up consultation links, take payments upfront, and let Slot. handle the time zones and reminders.
                </p>
              </div>

              {/* For Freelancers */}
              <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-7 h-7 text-blue-700" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-xl">For Freelance Pros</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  Stop the back-and-forth emails. Connect Google, Outlook, and iCloud to ensure you're never double-booked across client projects.
                </p>
              </div>

              {/* For Teams */}
              <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-blue-700" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-xl">For Small Agencies</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  Route leads to the right team member automatically. Manage availability for everyone from one simple, free dashboard.
                </p>
              </div>
            </div>
          </section>

          {/* 3. HOW IT WORKS SECTION */}
          <section className="max-w-5xl mx-auto px-6 py-20 text-center">
            <h2 className="text-4xl font-black mb-16 tracking-tight">Booking Made Beautifully Simple</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 shadow-md">
                  <CalendarCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-xl mb-2">1. Sync Your Life</h3>
                <p className="text-slate-600 max-w-xs leading-relaxed">Connect all your calendars in seconds. We check for conflicts so you don't have to.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 shadow-md">
                  <LinkIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-xl mb-2">2. Share Your Link</h3>
                <p className="text-slate-600 max-w-xs leading-relaxed">Add your custom Slot. link to your Instagram bio, email signature, or portfolio site.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 shadow-md">
                  <MousePointerClick className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-xl mb-2">3. Get Booked (and Paid)</h3>
                <p className="text-slate-600 max-w-xs leading-relaxed">Clients pick a time, pay the deposit, and the meeting is instantly on both your calendars.</p>
              </div>
            </div>
          </section>

          {/* 4. TESTIMONIALS SECTION */}
          <section className="bg-blue-600 text-white py-20 px-6">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-4xl font-black mb-16 tracking-tight">Trusted by Independent Pros</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-blue-700 p-8 rounded-3xl shadow-lg border border-blue-500">
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={20} className="text-yellow-400" />)}
                  </div>
                  <p className="text-xl leading-relaxed mb-6 italic">
                    &ldquo;I was paying $15/month for Calendly just to have two event types. Slot. gave me everything for free, including the Stripe integration.&rdquo;
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <img src={getRandomAvatar("Jordan Reed")} alt="Jordan Reed" className="w-12 h-12 rounded-full border-2 border-white" />
                    <div className="text-left">
                      <p className="font-bold text-lg">Jordan Reed</p>
                      <p className="text-blue-200 text-sm">UX Designer</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-700 p-8 rounded-3xl shadow-lg border border-blue-500">
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={20} className="text-yellow-400" />)}
                  </div>
                  <p className="text-xl leading-relaxed mb-6 italic">
                    &ldquo;Slot. is the only tool I've found that actually understands the freelance workflow. Simple, clean, and best of all, truly free.&rdquo;
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <img src={getRandomAvatar("Sarah Chen")} alt="Sarah Chen" className="w-12 h-12 rounded-full border-2 border-white" />
                    <div className="text-left">
                      <p className="font-bold text-lg">Sarah Chen</p>
                      <p className="text-blue-200 text-sm">Marketing Consultant</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. HOST LIST SECTION */}
          <section id="browse" className="max-w-5xl mx-auto px-6 py-20">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Active Professionals on Slot.</h2>
              <div className="h-px flex-1 bg-slate-200 mx-8 hidden sm:block"></div>
            </div>

            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-40 bg-slate-50 animate-pulse rounded-2xl border border-slate-100" />
                ))}
              </div>
            }>
              <HostList />
            </Suspense>
          </section>

          {/* 6. FINAL CTA & FOOTER */}
          <footer className="bg-slate-50 py-20 px-6 text-center border-t border-slate-100 rounded-t-[3rem] shadow-inner-lg shadow-slate-100/50">
            <h3 className="text-4xl font-black mb-6 tracking-tight">Stop Paying to Get Booked.</h3>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of freelancers who are moving their business to Slot. High-end features shouldn't have a high-end price tag.
            </p>
            <Button asChild variant="default" size="lg" className="h-16 px-10 text-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
              <Link href="/auth/sign-up">Start for Free Forever</Link>
            </Button>
            <div className="mt-16 text-slate-400 text-sm">&copy; {new Date().getFullYear()} Slot. Inc. All premium features, $0.</div>
          </footer>
        </div>
    </section>
    
  )
}

async function HostList() {
  try {
    const supabase = await createClient()
    const { data: hosts, error: supabaseError } = await supabase
      .from('profiles')
      .select('username, first_name, last_name')
      .eq('role', 'pro')
      .not('username', 'is', null)
      .limit(9)

    if (supabaseError) throw new Error(supabaseError.message)
    if (!hosts || hosts.length === 0) return <p className="text-slate-400 text-center">No professionals registered yet.</p>

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hosts.map((host) => (
          <Link 
            key={host.username} 
            href={`/${host.username}`} 
            className="p-6 bg-white border border-slate-200 rounded-3xl block hover:border-blue-500 hover:shadow-xl hover:shadow-blue-100/50 transition-all group relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10 mb-4">
              <img 
                src={getRandomAvatar(host.username || "User")} 
                alt={host.username || "Professional"} 
                className="w-16 h-16 rounded-full border-2 border-blue-100 group-hover:border-blue-300 transition-colors"
              />
              <div>
                <h3 className="font-bold text-xl group-hover:text-blue-600 transition-colors capitalize">
                  {host.first_name} {host.last_name} 
                </h3>
                <p className="text-sm text-slate-500">Creative Professional</p> 
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed relative z-10 mb-4">
              "Booking clients has never been smoother. Switching to Slot. saved me hours of admin every week."
            </p> 
            <div className="flex items-center text-sm font-bold text-blue-600 uppercase tracking-wider relative z-10">
              Grab a Slot
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        ))}
      </div>
    )
  } catch (err: any) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-sm">
        Could not load professionals.
      </div>
    )
  }
}