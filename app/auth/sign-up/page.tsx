import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
function BenefitItem({ icon, title, desc }: { icon: string, title: string, desc: string }) {
    return (
      <div className="flex gap-4 group">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-lg text-white">{title}</h4>
          <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
        </div>
      </div>
    );
  }
  return ( 
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* LEFT SIDE: THE FORM */}
      <div className="flex flex-col items-center justify-center p-6 lg:p-10 bg-white">
        <div className="w-full max-w-[480px]">
          <SignUpForm />
        </div>
      </div>

      {/* RIGHT SIDE: THE CONTENT (VALUE PROP) */}
      <div className="hidden lg:flex flex-col justify-center p-16 bg-slate-900 text-white relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:30px_30px]"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 max-w-xl">
          <h2 className="text-5xl font-black mb-8 tracking-tighter leading-tight">
            Stop chasing emails.<br /> 
            <span className="text-blue-500">Start booking clients.</span>
          </h2>
          
          {/* UPDATED BENEFIT LIST */}
          <div className="space-y-10 mb-16">
            <BenefitItem 
              icon="⚡" 
              title="Global Availability" 
              desc="Connect all your calendars and let Slot. handle time zones automatically for your international clients." 
            />
            <BenefitItem 
              icon="💰" 
              title="Paid Consultations" 
              desc="Link your Stripe account and collect payments upfront. No more ghosting, no more free labor." 
            />
            <BenefitItem 
              icon="🛠️" 
              title="Custom Workflows" 
              desc="Automate your follow-ups and reminders. Focus on your craft while we handle the administration." 
            />
          </div>

          {/* UPDATED TESTIMONIAL CARD */}
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl">
            <p className="text-xl font-medium italic mb-6 text-slate-200">
              "Slot. has completely automated my freelance onboarding. I save about 6 hours a week on scheduling alone. It's the best $0 I've ever spent."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center font-black text-white shadow-lg">
                JD
              </div>
              <div>
                <p className="font-bold text-lg">Jordan Duplantis</p>
                <p className="text-sm text-blue-400 font-medium">Independent Creative Director</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
