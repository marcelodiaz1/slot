"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Zap, ShieldAlert } from 'lucide-react';

const COMPARE_SLIDES = [
  {
    badge: "Market Disruptor",
    title: "The Calendly Alternative you've been waiting for.",
    text: "Stop paying for features that should be free. We took the 'standard' $15/mo plan and made it our baseline. For $0.",
    icon: <Swords className="w-5 h-5" />,
    color: "text-red-600",
    bgColor: "bg-red-50"
  },
  {
    badge: "Feature for Feature",
    title: "Don't settle for 'Lite' versions.",
    text: "Other 'free' plans limit your event types or block payments. Slot. gives you the full engine with zero restrictions.",
    icon: <Zap className="w-5 h-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    badge: "Hidden Costs",
    title: "No hidden 'Remove Branding' fees.",
    text: "Tired of paying $16/mo just to take their logo off your booking page? With Slot., your brand is the only brand that matters.",
    icon: <ShieldAlert className="w-5 h-5" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
];

export default function CompareHero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % COMPARE_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-32 pb-16 overflow-hidden bg-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-sm font-black tracking-widest uppercase rounded-full ${COMPARE_SLIDES[current].bgColor} ${COMPARE_SLIDES[current].color}`}>
              {COMPARE_SLIDES[current].icon}
              {COMPARE_SLIDES[current].badge}
            </div>

            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-slate-900">
              {COMPARE_SLIDES[current].title}
            </h1>

            <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed">
              {COMPARE_SLIDES[current].text}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-8">
          {COMPARE_SLIDES.map((_, i) => (
            <div key={i} className="h-1 w-20 bg-slate-100 rounded-full overflow-hidden">
              {current === i && (
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 5.5, ease: "linear" }}
                  className="h-full bg-slate-900"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}