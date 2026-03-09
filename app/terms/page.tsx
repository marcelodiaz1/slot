"use client";

import { motion } from "framer-motion";
import { EyeOff, MoveLeft } from "lucide-react";
import Link from "next/link";

interface LegalSection {
  id: string;
  heading: string;
  content: React.ReactNode;
}

export default function LegalPage({ title, lastUpdated }: { title: string, lastUpdated: string }) {
  const sections: LegalSection[] = [
    {
      id: "data-collection",
      heading: "1. Data Collection",
      content: (
        <>
          <p>We only collect information necessary to provide our service. This includes:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Identity Data:</strong> Name, email address, and profile photo.</li>
            <li><strong>Calendar Data:</strong> Availability slots and event metadata to prevent double-booking.</li>
            <li><strong>Usage Data:</strong> How you interact with our scheduling links.</li>
          </ul>
        </>
      )
    },
    {
      id: "security",
      heading: "2. Security & Storage",
      content: (
        <p>
          Slot. uses bank-grade AES-256 encryption to protect your calendar tokens. 
          Your data is stored in secure, SOC2-compliant data centers. Payment processing 
          is handled exclusively via <strong>Stripe</strong>; we never store your credit card details 
          on our servers.
        </p>
      )
    },
    {
      id: "third-parties",
      heading: "3. Third-Party Services",
      content: (
        <p>
          To provide a seamless experience, we integrate with Google Workspace, 
          Microsoft Outlook, and Zoom. Your data is only shared with these providers 
          to the extent necessary to create calendar invites and video meetings on 
          your behalf.
        </p>
      )
    },
    {
      id: "fair-use",
      heading: "4. Fair Use & Termination",
      content: (
        <p>
          Users must refrain from using Slot. for automated spam, phishing, or illegal 
          activities. We reserve the right to terminate or suspend accounts that 
          negatively impact the platform&apos;s performance or violate our community 
          standards without prior notice.
        </p>
      )
    },
    {
      id: "cookies",
      heading: "5. Cookies & Tracking",
      content: (
        <p>
          We use essential cookies to keep you logged in and functional cookies to 
          remember your preferences. We do not use cross-site tracking cookies for 
          advertising purposes.
        </p>
      )
    }
  ];

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 bg-slate-50/50">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors"
        >
          <MoveLeft size={16} />
          Back to Home
        </Link>
      </div>
      <div className="text-center mb-16">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-bold text-blue-600 bg-blue-100 rounded-full"
                >
                  <EyeOff className="w-4 h-4" />
                  Terms & Conditions
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-slate-900">
                  Term and conditions  
                </h1>
                <p className="text-slate-500 font-medium italic">Last Updated: February 26, 2026</p>
              </div>
      
      <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden"> 
        

        {/* Table of Contents (Desktop Only) */}
        <div className="grid grid-cols-1 md:grid-cols-12">
          <aside className="hidden md:block col-span-4 p-12 bg-slate-50/50 border-r border-slate-50">
            <nav className="sticky top-12 space-y-4">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Contents</p>
              {sections.map((section) => (
                <a 
                  key={section.id} 
                  href={`#${section.id}`}
                  className="block text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                >
                  {section.heading}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="col-span-1 md:col-span-8 p-8 md:p-16">
            <div className="space-y-16 text-slate-600 leading-relaxed text-lg">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-20">
                  <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">
                    {section.heading}
                  </h2>
                  <div className="space-y-4 font-medium text-slate-600">
                    {section.content}
                  </div>
                </section>
              ))}

              <hr className="border-slate-100" />

              <section className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Questions?</h3>
                <p className="text-sm">
                  If you have any questions regarding these terms, please contact our 
                  legal team at <a href="mailto:legal@slot.app" className="text-blue-600 font-bold underline">legal@slot.app</a>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}