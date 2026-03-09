"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointer2, CreditCard, Activity } from 'lucide-react';

const FEATURE_SLIDES = [
  {
    badge: "Coordination",
    title: "Meetings that actually happen.",
    text: "Automate the back-and-forth. Slot. checks your availability in real-time across all your calendars so you only ever talk when you want to.",
    icon: <MousePointer2 className="w-5 h-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    badge: "Monetization",
    title: "Get paid for your expertise.",
    text: "Turn your booking link into a storefront. Collect deposits or full payments via Stripe before the meeting even starts. No more chasing invoices.",
    icon: <CreditCard className="w-5 h-5" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    badge: "Automation",
    title: "Workflows on autopilot.",
    text: "From SMS reminders to post-meeting follow-ups, Slot. handles the busy work. Integrate with your favorite tools and save 5+ hours every week.",
    icon: <Activity className="w-5 h-5" />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  }
];

export default function FeaturesHero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % FEATURE_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-white">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Dynamic Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-sm font-bold tracking-wider uppercase rounded-full ${FEATURE_SLIDES[current].bgColor} ${FEATURE_SLIDES[current].color}`}>
              {FEATURE_SLIDES[current].icon}
              {FEATURE_SLIDES[current].badge}
            </div>

            {/* Dynamic Title */}
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-slate-900">
              {FEATURE_SLIDES[current].title}
            </h1>

            {/* Dynamic Description */}
            <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed">
              {FEATURE_SLIDES[current].text}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Slide Progress Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {FEATURE_SLIDES.map((_, i) => (
            <div
              key={i}
              className="h-1.5 bg-slate-100 rounded-full overflow-hidden w-16"
            >
              {current === i && (
                <motion.div
                  layoutId="progress-bar"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5.5, ease: "linear" }}
                  className={`h-full ${FEATURE_SLIDES[i].bgColor.replace('bg-', 'bg-').replace('50', '600')}`}
                  style={{ backgroundColor: 'currentColor' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}