"use client";

import { motion } from "framer-motion";
import { Mail, MessageSquare, Twitter, MapPin, Send, Sparkles, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ContactPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section with Floating Elements */}
        <div className="relative text-center mb-24">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-bold text-blue-600 bg-blue-50 rounded-full border border-blue-100"
          >
            <Sparkles className="w-4 h-4" />
            We usually respond in under 2 hours
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-slate-900">
            Let's build the <br /> 
            <span className="text-blue-600">future of work.</span>
          </h1>

          {/* Animated Background "Globe" Logic */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] opacity-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Info & "Cool Map" Visual */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="relative p-10 rounded-[3rem] bg-slate-900 text-white overflow-hidden group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-6 italic">Where we're at.</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <MapPin className="text-blue-400" />
                    </div>
                    <p className="text-lg text-slate-300">Remote-First • Built in Sydney</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <Globe className="text-blue-400" />
                    </div>
                    <p className="text-lg text-slate-300">Global Infrastructure (24 Regions)</p>
                  </div>
                </div>
              </div>

              {/* The "Cool Map" Aesthetic Component */}
              <div className="mt-10 h-64 w-full bg-slate-800 rounded-2xl relative overflow-hidden border border-white/5">
                <motion.div 
                  animate={{ 
                    scale: isHovered ? 1.1 : 1,
                    rotate: isHovered ? 2 : 0 
                  }}
                  className="absolute inset-0 opacity-40 grayscale contrast-125"
                  style={{ 
                    backgroundImage: 'url("/map.png")',
                    backgroundSize: 'cover'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                
                {/* Ping Animation on Map */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <span className="relative flex h-6 w-6">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-blue-500 shadow-xl shadow-blue-500/50"></span>
                  </span>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                <Twitter className="text-sky-500 mb-2" />
                <p className="font-bold text-sm">DM us on X</p>
              </div>
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                <MessageSquare className="text-emerald-500 mb-2" />
                <p className="font-bold text-sm">Live Chat</p>
              </div>
            </div>
          </div>

          {/* RIGHT: The "Amazing" Form */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-7 bg-white p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-2xl shadow-blue-100/50"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">Your Name</label>
                  <input 
                    type="text" 
                    placeholder="Jane Doe" 
                    className="w-full p-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-900 font-medium outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">Work Email</label>
                  <input 
                    type="email" 
                    placeholder="jane@hustle.com" 
                    className="w-full p-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-900 font-medium outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">What's on your mind?</label>
                <select className="w-full p-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-900 font-medium outline-none appearance-none">
                  <option>General Inquiry</option>
                  <option>Feature Request</option>
                  <option>Report a Bug</option>
                  <option>Partnership</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-2">Message</label>
                <textarea 
                  rows={5} 
                  placeholder="Tell us everything..." 
                  className="w-full p-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-900 font-medium outline-none"
                ></textarea>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full h-20 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] text-xl font-black gap-3 shadow-xl shadow-blue-200">
                  Send Message
                  <Send className="w-6 h-6" />
                </Button>
              </motion.div>
            </form>
          </motion.div>

        </div>
      </div>
    </main>
  );
}