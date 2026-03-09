"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiggyBank, Unlock, Zap } from 'lucide-react';

const PRICE_SLIDES = [
  {
    badge: "The End of Subscriptions",
    title: "Stop paying the 'Scheduling Tax'.",
    text: "Why pay $15/month for a tool that just manages your time? Slot. gives you every premium feature for exactly $0. Forever.",
    icon: <PiggyBank className="w-5 h-5" />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100"
  },
  {
    badge: "No Paywalls",
    title: "Full access. No 'Pro' tier limits.",
    text: "Unlimited event types, custom branding, and automated workflows. We don't hide the best features behind a credit card gate.",
    icon: <Unlock className="w-5 h-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    badge: "Built for Growth",
    title: "Free for one. Scalable for teams.",
    text: "Our mission is to help freelancers grow. We only make money when you start scaling into a full-sized agency.",
    icon: <Zap className="w-5 h-5" />,
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  }
];

export default function PricingHero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % PRICE_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-32 pb-16 overflow-hidden bg-white">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "circOut" }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-sm font-black tracking-widest uppercase rounded-full ${PRICE_SLIDES[current].bgColor} ${PRICE_SLIDES[current].color}`}>
              {PRICE_SLIDES[current].icon}
              {PRICE_SLIDES[current].badge}
            </div>

            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-slate-900">
              {PRICE_SLIDES[current].title}
            </h1>

            <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed">
              {PRICE_SLIDES[current].text}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Custom Progress Dots */}
        <div className="flex justify-center gap-3 mt-4">
          {PRICE_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`group relative h-2 rounded-full overflow-hidden transition-all duration-500 ${
                current === i ? "w-16 bg-slate-200" : "w-2 bg-slate-100"
              }`}
            >
              {current === i && (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 5.5, ease: "linear" }}
                  className="absolute inset-0 bg-blue-600"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}