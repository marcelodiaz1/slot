"use client";

import IntegrationsHero from "@/components/IntegrationsHero";
import { motion } from "framer-motion";
import { CheckCircle2, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

const APPS = [
  { 
    name: "Google Calendar", 
    desc: "Sync work & personal", 
    icon: "/apps/google-calendar.svg", // Local path
    category: "Calendar" 
  },
  { 
    name: "Microsoft Outlook", 
    desc: "Enterprise ready", 
    icon: "/apps/outlook.svg", 
    category: "Calendar" 
  },
  { 
    name: "Stripe", 
    desc: "Collect payments", 
    icon: "/apps/stripe.svg", 
    category: "Payments" 
  },
  { 
    name: "Zoom", 
    desc: "Auto-generate links", 
    icon: "/apps/zoom.svg", 
    category: "Video" 
  },
  { 
    name: "Google Meet", 
    desc: "One-click meetings", 
    icon: "/apps/google-meet.svg", 
    category: "Video" 
  },
  { 
    name: "Zapier", 
    desc: "Connect 5000+ apps", 
    icon: "/apps/zapier.svg", 
    category: "Automation" 
  },
];

export default function IntegrationsPage() {
  return (
    <main className="min-h-screen bg-white">
      <IntegrationsHero />

      {/* Categories / Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {APPS.map((app, i) => (
            <motion.div
              key={app.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500"
            >
              <div className="w-16 h-16 mb-6 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                <img src={app.icon} alt={app.name} className="w-10 h-10 object-contain" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                 <h3 className="text-2xl font-bold text-slate-900">{app.name}</h3>
                 <CheckCircle2 className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-slate-500 mb-6 font-medium">{app.desc}</p>
              <div className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                {app.category}
              </div>
            </motion.div>
          ))}

          {/* Request New Integration Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center group hover:border-blue-400 transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
              <Plus className="w-8 h-8 text-slate-400 group-hover:text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Request App</h3>
            <p className="text-slate-500 text-sm">Don't see your stack? <br/>We'll build it for you.</p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-slate-900 py-24 px-6 mx-6 rounded-[3rem] mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
            Stop switching tabs. <br/>Start getting booked.
          </h2>
          <Button asChild size="lg" className="h-16 px-12 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl">
            <Link href="/auth/sign-up">Connect Your First Calendar</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}