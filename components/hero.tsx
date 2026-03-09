"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, DollarSign } from 'lucide-react';

const SLIDES = [
  {
    badge: "The Free Scheduler for Freelancers",
    title: "Your Time is Money. Slot. Saves Both.",
    text: "Connect all your calendars, eliminate double-bookings, and look professional—without the $15/mo subscription.",
    icon: <Zap className="w-5 h-5" />,
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200"
  },
  {
    badge: "Built for Content Creators",
    title: "Focus on Content. Not Scheduling.",
    text: "Take paid consultations, manage fan meets, and automate your workflow. Every 'Pro' feature is $0 forever.",
    icon: <Sparkles className="w-5 h-5" />,
    image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&q=80&w=1200"
  },
  {
    badge: "Premium Features for $0",
    title: "Cancel Your Calendly Subscription.",
    text: "Why pay to get booked? Get unlimited event types, custom branding, and automated reminders for free.",
    icon: <DollarSign className="w-5 h-5" />,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 pt-20 pb-24">
      {/* Background Image Morphing */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.07, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${SLIDES[current].image})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-sm font-semibold tracking-wide text-blue-600 uppercase bg-blue-50 rounded-full">
              {SLIDES[current].icon}
              {SLIDES[current].badge}
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-slate-900">
              {SLIDES[current].title.split("Slot.").map((part, i) => (
                <span key={i}>
                  {part}
                  {i === 0 && SLIDES[current].title.includes("Slot.") && (
                    <span className="text-blue-600">Slot.</span>
                  )}
                </span>
              ))}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              {SLIDES[current].text}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Buttons (Static, so they don't flicker) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="h-16 px-10 text-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-200 rounded-2xl transition-all hover:scale-105 active:scale-95">
            <Link href="/auth/sign-up">Get Your Free Link</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="h-16 px-10 text-xl font-semibold text-slate-600 hover:bg-slate-100 rounded-2xl">
            <Link href="#features">See How it Works</Link>
          </Button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-3 mt-16">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-500 ${
                current === i ? "w-12 bg-blue-600" : "w-2 bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}