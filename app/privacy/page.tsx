"use client";

import { motion } from "framer-motion";
import { ShieldCheck, EyeOff, Lock, Database, Globe, Bell } from "lucide-react";

const PRIVACY_SECTIONS = [
  {
    title: "Data We Collect",
    icon: <Database className="w-6 h-6 text-blue-600" />,
    content: "We only collect what is strictly necessary to schedule your meetings. This includes your email, name, and encrypted tokens to access your connected calendars. We do not read your emails or access private documents."
  },
  {
    title: "How We Use It",
    icon: <Lock className="w-6 h-6 text-emerald-600" />,
    content: "Your data is used solely to check availability and create calendar events. We never sell your personal information or client lists to third-party advertisers. Your business is your business."
  },
  {
    title: "Security Measures",
    icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
    content: "We use AES-256 bank-grade encryption for all data at rest and SSL/TLS for all data in transit. Our infrastructure is hosted on SOC2 compliant servers."
  },
  {
    title: "Third-Party Sharing",
    icon: <Globe className="w-6 h-6 text-orange-600" />,
    content: "We only share data with essential sub-processors like Stripe (for payments) and Supabase (for authentication). We strictly vet every partner for GDPR compliance."
  }
];

export default function PrivacyPage() {
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
            <EyeOff className="w-4 h-4" />
            Your Privacy Matters
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-slate-500 font-medium italic">Last Updated: February 26, 2026</p>
        </div>

        {/* Visual Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {PRIVACY_SECTIONS.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm"
            >
              <div className="mb-4">{section.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{section.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Detailed Content */}
        <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-sm border border-slate-100 prose prose-slate max-w-none">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Full Disclosure</h2>
          <p className="text-slate-600 mb-8">
            This Privacy Policy describes how Slot. ("we", "us", or "our") collects, uses, and shares your personal information when you use our scheduling platform. By using the Service, you agree to the collection and use of information in accordance with this policy.
          </p>

          <h3 className="text-xl font-bold text-slate-900 mt-10 mb-4">1. Information Collection</h3>
          <p className="text-slate-600">
            When you register for an account, we ask for information such as your name and email address. For calendar synchronization, we use OAuth2 protocols to securely connect to your Google or Microsoft accounts without ever seeing your password.
          </p>

          <h3 className="text-xl font-bold text-slate-900 mt-10 mb-4">2. Payment Information</h3>
          <p className="text-slate-600">
            We use Stripe for payment processing. We do not store your credit card details on our servers. Stripe's use of your personal information is governed by their Privacy Policy.
          </p>

          <h3 className="text-xl font-bold text-slate-900 mt-10 mb-4">3. Your Rights (GDPR/CCPA)</h3>
          <p className="text-slate-600">
            Depending on your location, you may have the right to access, correct, or delete your personal data. You can export your data or delete your account at any time directly from the user dashboard.
          </p>

          <div className="mt-16 p-8 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
            <Bell className="text-blue-600 w-6 h-6 mt-1" />
            <div>
              <h4 className="font-bold text-blue-900">Policy Updates</h4>
              <p className="text-blue-800/80 text-sm">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and sending an email notification for significant changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}