"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, PartyPopper, Heart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PricingHero from "@/components/PricingHero";

const PERKS = [
  "Unlimited Event Types",
  "Unlimited Calendar Sync",
  "Stripe Payment Integration",
  "Automated Email Reminders",
  "Custom Branding (No 'Powered by Slot')",
  "Group Bookings & Round Robin",
  "Video Call Auto-Generation"
];

export default function PricingPage() {
  return (
    <section>
        <PricingHero/>
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-bold text-emerald-600 bg-emerald-100 rounded-full"
            >
            <Sparkles className="w-4 h-4" />
            The Forever Free Manifesto
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Price shouldn't be a <span className="text-blue-600">barrier.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            We believe scheduling is a basic utility, not a luxury. That's why Slot. is $0 for freelancers, forever.
            </p>
        </div>

        <div className="max-w-3xl mx-auto">
            <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border-4 border-blue-600 overflow-hidden"
            >
            {/* "The Only Plan" Ribbon */}
            <div className="absolute top-12 -right-12 rotate-45 bg-blue-600 text-white px-12 py-2 font-bold text-sm tracking-widest shadow-lg">
                THE ONLY PLAN
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                <div>
                <h2 className="text-4xl font-black text-slate-900 mb-2">The Pro Plan</h2>
                <p className="text-slate-500 font-medium text-lg">Everything you need to scale.</p>
                </div>
                <div className="text-left md:text-right">
                <div className="text-6xl font-black text-blue-600">$0</div>
                <div className="text-slate-400 font-bold uppercase tracking-widest text-sm">Per Month / Forever</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {PERKS.map((perk, i) => (
                <motion.div 
                    key={perk}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-slate-700 font-semibold"
                >
                    <div className="bg-emerald-100 p-1 rounded-full">
                    <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    {perk}
                </motion.div>
                ))}
            </div>

            <Button asChild size="lg" className="w-full h-20 text-2xl font-black bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 rounded-2xl group">
                <Link href="/auth/sign-up" className="flex items-center justify-center gap-3">
                Claim Your Free Account
                <PartyPopper className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </Link>
            </Button>
            </motion.div>

            {/* Why is it free? Section */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Heart className="text-blue-600 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Why is it free?</h3>
                <p className="text-slate-600 leading-relaxed">
                We make money through optional pro-integrations for large agencies and a tiny fee on payments you collect. For the individual freelancer, we stay free.
                </p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="text-emerald-600 w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">No Credit Card Required</h3>
                <p className="text-slate-600 leading-relaxed">
                You won't find a "Free Trial" here. Sign up with your email, connect your calendar, and start booking. No strings, no surprises.
                </p>
            </div>
            </div>
        </div>
        </div>
    </section>
  );
}