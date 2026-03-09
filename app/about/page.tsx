"use client";

import { motion } from "framer-motion";
import { Heart, Rocket, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black tracking-tighter mb-8"
        >
          We believe time is <span className="text-blue-600">freedom.</span>
        </motion.h1>
        
        <div className="prose prose-lg text-slate-600 leading-relaxed">
          <p className="text-xl font-medium text-slate-900 mb-6">
            Slot. was born out of a simple frustration: Why are freelancers paying a "subscription tax" just to let people book their time?
          </p>
          <p className="mb-6">
            In the gig economy, every dollar counts. We saw the industry leaders raising prices while locking basic features like "Stripe Payments" and "Multiple Calendars" behind $15/month paywalls. We decided to build a better way.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="text-blue-600 w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900">User First</h4>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="text-emerald-600 w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900">Zero Friction</h4>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="text-purple-600 w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900">Always Free</h4>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Commitment</h2>
          <p>
            Slot. is committed to providing premium scheduling infrastructure for $0. We monetize through high-level team features and a tiny convenience fee on transactions—ensuring that for the solo-hustler, the tool remains a free utility forever.
          </p>
        </div>
      </div>
    </main>
  );
}