"use client";

import { motion } from "framer-motion";
import { Rocket, Zap, Bug, Sparkles, RefreshCcw, Star } from "lucide-react";

const UPDATES = [
  {
    version: "v2.1.0",
    date: "March 4, 2026",
    title: "The Team Power-Up",
    icon: <Rocket className="w-6 h-6 text-blue-600" />,
    description: "Major updates to how professionals and team members interact.",
    changes: [
      "Added Team Member booking assignment logic",
      "Dynamic brand color synchronization across professional profiles",
      "New 'Client Selection' pool for shared team access",
      "Enhanced conflict detection for multi-pro schedules"
    ],
    tag: "Major Update"
  },
  {
    version: "v2.0.4",
    date: "February 28, 2026",
    title: "UI Polish & Speed",
    icon: <Zap className="w-6 h-6 text-emerald-600" />,
    description: "Refined the dashboard experience for faster navigation.",
    changes: [
      "Optimized server-side data fetching for booking lists",
      "Added 'Tile' headers to all dashboard sub-pages",
      "Improved mobile responsiveness for the calendar view"
    ],
    tag: "Improvement"
  },
  {
    version: "v2.0.2",
    date: "February 22, 2026",
    title: "Bug Squashing",
    icon: <Bug className="w-6 h-6 text-purple-600" />,
    description: "Fixed small inconsistencies in client data mapping.",
    changes: [
      "Resolved issue where duplicate clients appeared in lists",
      "Fixed background color clipping on custom brand buttons",
      "Corrected 'Edit Booking' redirect paths"
    ],
    tag: "Fix"
  }
];

export default function Changelog() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-bold text-blue-600 bg-blue-100 rounded-full"
          >
            <Sparkles className="w-4 h-4" />
            What's New in Slot.
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-slate-900">
            Changelog
          </h1>
          <p className="text-slate-500 font-medium">Tracking every improvement and new feature.</p>
        </div>

        {/* Timeline Section */}
        <div className="space-y-12">
          {UPDATES.map((update, i) => (
            <motion.div
              key={update.version}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative pl-8 md:pl-0"
            >
              {/* Vertical Line for Desktop */}
              <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* Date & Version Side */}
                <div className={`flex flex-col ${i % 2 === 0 ? 'md:items-end md:text-right' : 'md:order-last md:items-start md:text-left'}`}>
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                      {update.version}
                    </span>
                  </div>
                  <p className="text-slate-400 font-bold text-sm">{update.date}</p>
                </div>

                {/* Content Card Side */}
                <div className="relative group">
                  {/* Timeline Dot */}
                  <div className={`hidden md:flex absolute top-8 w-10 h-10 rounded-full bg-white border-4 border-slate-50 shadow-sm z-10 items-center justify-center
                    ${i % 2 === 0 ? '-left-[2.75rem]' : '-right-[2.75rem]'}`}>
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>

                  <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-slate-50 rounded-2xl">
                        {update.icon}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">{update.title}</h3>
                    </div>
                    
                    <p className="text-slate-600 mb-6 font-medium">
                      {update.description}
                    </p>

                    <ul className="space-y-3">
                      {update.changes.map((change, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-slate-500">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-4 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
            <RefreshCcw className="w-5 h-5 text-blue-600 animate-spin-slow" />
            <p className="text-slate-600 font-bold text-sm">
              We ship updates weekly. Check back soon for more.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}