"use client";

import CompareHero from "@/components/CompareHero";
import { motion } from "framer-motion";
import { Check, X, Minus, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const COMPETITORS = [
  // CORE SCHEDULING
  { 
    category: "Core Scheduling",
    feature: "Price (Per Month)", 
    slot: "$0", 
    calendly: "$12", 
    acuity: "$20", 
    tidycal: "$29 (One-time)",
    doodle: "$15"
  },
  { 
    feature: "Unlimited Event Types", 
    slot: true, 
    calendly: false, 
    acuity: true, 
    tidycal: true,
    doodle: false 
  },
  { 
    feature: "Group Polls", 
    slot: true, 
    calendly: true, 
    acuity: false, 
    tidycal: true,
    doodle: true 
  },
  // CUSTOMIZATION
  { 
    category: "Customization",
    feature: "Remove Branding", 
    slot: true, 
    calendly: "Paid only", 
    acuity: "Paid only", 
    tidycal: "Reduced",
    doodle: "Paid only" 
  },
  { 
    feature: "Custom Brand Colors", 
    slot: true, 
    calendly: "Paid only", 
    acuity: true, 
    tidycal: false,
    doodle: false 
  },
  // BUSINESS TOOLS
  { 
    category: "Business Tools",
    feature: "Collect Payments", 
    slot: true, 
    calendly: "Paid only", 
    acuity: true, 
    tidycal: "Paid only",
    doodle: "Paid only" 
  },
  { 
    feature: "Auto-Workflows", 
    slot: true, 
    calendly: "Paid only", 
    acuity: "Paid only", 
    tidycal: false,
    doodle: false 
  },
  { 
    feature: "Team Management", 
    slot: true, 
    calendly: "Paid only", 
    acuity: "Paid only", 
    tidycal: "Limited",
    doodle: "Paid only" 
  },
];

export default function ComparePage() {
  return (
    <section>        
        <CompareHero />
        <main className="min-h-screen bg-white">
        <section className="max-w-[1400px] mx-auto px-6 py-24">
            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto rounded-[3rem] border border-slate-200 shadow-2xl">
            <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-8 text-xl font-bold text-slate-400 w-1/4">Features</th>
                    <th className="p-8 text-center bg-blue-50">
                    <span className="text-2xl font-black text-blue-600 flex items-center justify-center gap-2">
                        <Zap className="w-6 h-6 fill-blue-600" /> Slot.
                    </span>
                    </th>
                    <th className="p-8 text-center text-xl font-bold text-slate-400">Calendly</th>
                    <th className="p-8 text-center text-xl font-bold text-slate-400">Acuity</th>
                    <th className="p-8 text-center text-xl font-bold text-slate-400">TidyCal</th>
                    <th className="p-8 text-center text-xl font-bold text-slate-400">Doodle</th>
                </tr>
                </thead>
                <tbody>
                    {COMPETITORS.map((row, i) => (
                        // Use a Fragment instead of a <section> to group multiple rows
                        <React.Fragment key={row.feature}> 
                        
                        {/* Category Header Row */}
                        {row.category && (
                            <tr className="bg-slate-50/50">
                            <td colSpan={6} className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 border-b border-slate-100">
                                {row.category}
                            </td>
                            </tr>
                        )}

                        {/* Feature Data Row */}
                        <motion.tr 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} // Recommended for performance
                            transition={{ delay: i * 0.05 }}
                            className="border-b border-slate-100 hover:bg-slate-50/30 transition-colors group"
                        >
                            <td className="p-8 font-bold text-slate-900 text-lg">
                            {row.feature}
                            </td>
                            
                            {/* Slot Column (Highlighted) */}
                            <td className="p-8 bg-blue-50/30 relative">
                            <div className="flex justify-center">
                                {typeof row.slot === "boolean" ? (
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
                                    <Check className="text-white w-5 h-5" />
                                </div>
                                ) : (
                                <span className="text-blue-600 font-black text-xl">{row.slot}</span>
                                )}
                            </div>
                            </td>

                            {/* Competitor Columns */}
                            {[row.calendly, row.acuity, row.tidycal, row.doodle].map((val, idx) => (
                            <td key={idx} className="p-8 text-center">
                                <div className="flex justify-center">
                                {val === true ? (
                                    <Check className="text-slate-400 w-6 h-6" />
                                ) : val === false ? (
                                    <X className="text-red-200 w-6 h-6" />
                                ) : (
                                    <span className="text-slate-500 font-bold text-xs bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap">
                                    {val}
                                    </span>
                                )}
                                </div>
                            </td>
                            ))}
                        </motion.tr>
                        </React.Fragment>
                    ))}
                    </tbody>
            </table>
            </div>

            {/* Breakdown of Competitors */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white">
                <h3 className="text-3xl font-black mb-4 italic italic">"But TidyCal is a lifetime deal..."</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                    TidyCal is great, but their "Lifetime" plan still costs $29 today. And if you need team features or SMS reminders, that price jumps. **Slot.** gives you those same workflows for $0. No entry fee, no lifetime lock-in.
                </p>
            </div>
            <div className="p-10 rounded-[2.5rem] bg-blue-600 text-white">
                <h3 className="text-3xl font-black mb-4 italic">"Why Acuity costs $20/mo?"</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                    Acuity targets high-end retail and spas. If you’re a solo freelancer or a dev agency, you’re paying for 80% of features you’ll never use. Slot. is lean, fast, and built for your specific workflow.
                </p>
            </div>
            </div>
        </section>
        </main>
    </section>
  );
}