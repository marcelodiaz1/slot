"use client";
import { LoginForm } from "@/components/login-form";
import { CheckCircle2, Clock, ShieldCheck, Zap } from "lucide-react";

export default function Page() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-white">
      {/* LEFT SIDE: THE FORM */}
      <div className="flex flex-col items-center justify-center p-6 md:p-10 bg-white">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>

      {/* RIGHT SIDE: THE CONTENT (TRUST & EFFICIENCY) */}
      <div className="hidden lg:flex flex-col justify-center p-16 bg-blue-600 text-white relative overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        
        <div className="relative z-10 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/50 border border-white/20 text-xs font-bold uppercase tracking-widest mb-6">
            <Zap className="w-3 h-3 fill-white" />
            Productivity Engine
          </div>

          <h2 className="text-5xl font-black mb-10 leading-[1.1] tracking-tight">
            The world is <br /> 
            <span className="text-blue-200">booking you.</span>
          </h2>

          <div className="space-y-6 mb-12">
            <div className="flex items-start gap-4 p-5 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/10 transition-all hover:bg-white/15">
              <div className="bg-blue-400/20 p-2 rounded-lg">
                <Clock className="w-6 h-6 text-blue-100" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Save 5+ hours weekly</h4>
                <p className="text-blue-100/80 text-sm">Automated scheduling handles the heavy lifting so you can focus on your craft.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/10 transition-all hover:bg-white/15">
              <div className="bg-blue-400/20 p-2 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-blue-100" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Cross-Calendar Sync</h4>
                <p className="text-blue-100/80 text-sm">One link to rule them all. We sync with Google, Outlook, and Apple seamlessly.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/10 transition-all hover:bg-white/15">
              <div className="bg-blue-400/20 p-2 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-blue-100" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Privacy Guaranteed</h4>
                <p className="text-blue-100/80 text-sm">Professional encryption standards that keep your business and client data private.</p>
              </div>
            </div>
          </div>

          {/* STATUS INDICATOR */}
          <div className="p-6 bg-slate-900/30 rounded-[2rem] border border-white/10 flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
              <span className="text-xs font-bold text-blue-100 uppercase tracking-tighter">API Response: 14ms</span>
            </div>
            <span className="text-[10px] text-blue-200/50 font-mono tracking-widest">ENCRYPTED SESSION</span>
          </div>
        </div>
      </div>
    </div>
  );
}