"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Zap, CreditCard, ChevronRight } from "lucide-react";

const FEATURES = [
  {
    id: 1,
    title: "Universal Calendar Sync",
    description: "Connect Google, Outlook, and iCloud simultaneously. We check for conflicts across all your projects so you're never double-booked.",
    icon: <Calendar className="w-6 h-6" />,
    // Using Unsplash images for a more "Freelancer/Modern" feel than placeholders
    image: "pexels-rdne-7580934.jpg",
    color: "#2563eb"
  },
  {
    id: 2,
    title: "Paid Appointments",
    description: "Connect Stripe and collect payments or deposits the moment a client books. No more chasing invoices after the meeting.",
    icon: <CreditCard className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
    color: "#8b5cf6"
  },
  {
    id: 3,
    title: "Workflow Automation",
    description: "Trigger custom email sequences, SMS reminders, and Zapier zaps. What usually costs $16/mo is yours for free.",
    icon: <Zap className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    color: "#10b981"
  }
];

export default function AnimatedFeatures() {
  const [activeTab, setActiveTab] = useState(0);

  // Auto-play effect
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % FEATURES.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="text-4xl font-black text-center mb-16 tracking-tight">Your Business on Autopilot.</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT SIDE: Accordion Controls */}
        <div className="space-y-4">
          {FEATURES.map((feature, index) => (
            <div 
              key={feature.id}
              onClick={() => setActiveTab(index)}
              className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 border-l-4 text-left ${
                activeTab === index 
                ? "bg-slate-50 border-blue-600 shadow-sm" 
                : "bg-transparent border-transparent hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-4 mb-2">
                <div style={{ color: activeTab === index ? feature.color : "#94a3b8" }}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold ${activeTab === index ? "text-slate-900" : "text-slate-500"}`}>
                  {feature.title}
                </h3>
              </div>
              
              <AnimatePresence>
                {activeTab === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-slate-600 mt-2 leading-relaxed">
                      {feature.description}
                    </p>
                    {/* Animated Progress Bar */}
                    <div className="w-full h-1 bg-slate-200 mt-4 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        className="h-full"
                        style={{ backgroundColor: feature.color }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE: Animated Image Display */}
        <div className="relative h-[500px] w-full bg-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeTab}
              src={FEATURES[activeTab].image}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full object-cover"
              alt={FEATURES[activeTab].title}
            />
          </AnimatePresence>
          {/* Subtle Overlay to make it look like a UI window */}
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[2.5rem]" />
        </div>

      </div>
    </section>
  );
}