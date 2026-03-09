"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Link2, Puzzle } from 'lucide-react';

const INT_SLIDES = [
  {
    badge: "Calendar Harmony",
    title: "All your calendars, synced in one Slot.",
    text: "Google, Outlook, and iCloud. We cross-check every single one of them in real-time to ensure you are never double-booked across life and work.",
    icon: <Link2 className="w-5 h-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    badge: "Payments & Revenue",
    title: "Integrated payments with Stripe.",
    text: "Don't just book a meeting—book a sale. Connect your Stripe account to handle deposits, full payments, and automatic tax invoicing instantly.",
    icon: <Puzzle className="w-5 h-5" />,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  },
  {
    badge: "Video & Comms",
    title: "Meet where you want, when you want.",
    text: "From Zoom and Google Meet to Microsoft Teams. Slot. automatically generates unique meeting links and sends them to your clients.",
    icon: <Share2 className="w-5 h-5" />,
    color: "text-cyan-600",
    bgColor: "bg-cyan-50"
  }
];

export default function IntegrationsHero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % INT_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-white border-b border-slate-100">
      {/* Animated Floating Logos Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%] w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center p-3 border border-slate-100"
        >
          <img src="/apps/google-calendar.svg" alt="Google" />
        </motion.div>
        <motion.div 
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-[15%] w-14 h-14 bg-white shadow-xl rounded-2xl flex items-center justify-center p-3 border border-slate-100"
        >
          <img src="/apps/stripe.svg" alt="Stripe" />
        </motion.div>
        <motion.div 
          animate={{ 
            y: [0, -40, 0],
            x: [0, 20, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-[12%] w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center p-4 border border-slate-100"
        >
          <img src="/apps/zoom.svg" alt="Zoom" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-sm font-black tracking-widest uppercase rounded-full ${INT_SLIDES[current].bgColor} ${INT_SLIDES[current].color}`}>
              {INT_SLIDES[current].icon}
              {INT_SLIDES[current].badge}
            </div>

            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-tight text-slate-900">
              {INT_SLIDES[current].title}
            </h1>

            <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed">
              {INT_SLIDES[current].text}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Nav */}
        <div className="flex justify-center gap-4 mt-12">
          {INT_SLIDES.map((slide, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 transition-all duration-500 rounded-full ${current === i ? "w-24 bg-blue-600" : "w-12 bg-slate-100"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}