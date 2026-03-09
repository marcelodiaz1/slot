"use client";

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, Link as LinkIcon, Palette, DollarSign, BellRing, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming your button component
import FeaturesHero from '@/components/FeaturesHero';

// Feature Data
const PRODUCT_FEATURES = [
  {
    id: 1,
    title: "Smarter Scheduling Links",
    description: "Create unlimited, personalized booking links for every service, client, or consultation. Slot. handles all the time zone conversions, buffers, and busy checks across your connected calendars.",
    icon: <LinkIcon className="w-8 h-8 text-blue-600" />,
    image: "img1.png"
  },
  {
    id: 2,
    title: "Seamless Payment Collection",
    description: "Connect Stripe and get paid upfront for your time. Reduce no-shows and ensure commitment from clients. Set deposits, full payments, or free consultations effortlessly.",
    icon: <DollarSign className="w-8 h-8 text-green-600" />,
    image: "img2.png"
  },
  {
    id: 3,
    title: "Branded Booking Experience",
    description: "Your brand, front and center. Customize your booking page with your logo, colors, and unique messaging. Remove our branding entirely—a premium feature, now yours for free.",
    icon: <Palette className="w-8 h-8 text-purple-600" />,
    image: "img3.png"
  },
  {
    id: 4,
    title: "Automated Reminders & Follow-ups",
    description: "Eliminate manual communication. Slot. sends intelligent reminders via email and SMS, reducing no-shows and keeping your clients informed. After the meeting, follow-ups can be automated too.",
    icon: <BellRing className="w-8 h-8 text-orange-600" />,
    image: "img4.png"
  },
  {
    id: 5,
    title: "Team Scheduling & Routing",
    description: "Growing your agency? Route incoming bookings to the right team member based on availability, expertise, or workload. Manage multiple calendars from one unified dashboard.",
    icon: <Users className="w-8 h-8 text-red-600" />,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1400&h=700&crop=entropy"
  },
  {
    id: 6,
    title: "Client Search & Management",
    description: "Quickly find client details, past appointments, and communication history. Keep everything organized and accessible, giving you a complete overview of your client relationships.",
    icon: <Search className="w-8 h-8 text-cyan-600" />,
    image: "img5.png"
  },
];

const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true, amount: 0.3 }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white p-8 md:p-12 rounded-[2rem] shadow-lg border border-slate-100 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
    >
      <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'} `}>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-full bg-blue-50">
            {feature.icon}
          </div>
          <h3 className="text-3xl font-bold text-slate-900">{feature.title}</h3>
        </div>
        <p className="text-lg text-slate-600 leading-relaxed">
          {feature.description}
        </p>
      </div>
      <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'} `}>
        <motion.img
          src={feature.image}
          alt={feature.title}
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          viewport={{ once: true, amount: 0.5 }}
          className="w-full h-auto rounded-3xl shadow-xl border border-slate-200"
        />
      </div>
    </motion.div>
  );
};

export default function ProductPage() {
  return (
    <section>
        <FeaturesHero />
        <div className="min-h-screen bg-slate-50 text-slate-900">
        <section className="relative max-w-7xl mx-auto pt-24 pb-16 px-6 text-center">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            >
            <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-blue-600 uppercase bg-blue-100 rounded-full">
                Unleash Your Productivity
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                Every Feature You Need. <span className="text-blue-600">For Free.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                Stop compromising on functionality or paying for basic essentials. Slot. delivers a complete suite of professional scheduling tools designed to empower your business, not drain your wallet.
            </p>
            <Button asChild size="lg" className="h-14 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                <Link href="/auth/sign-up">Start Saving Time & Money</Link>
            </Button>
            </motion.div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20 space-y-20">
            {PRODUCT_FEATURES.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
        </section>

        <section className="max-w-4xl mx-auto text-center py-20 px-6">
            <h2 className="text-4xl font-black mb-6">Ready to Experience the Difference?</h2>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Switch to Slot. today and discover a world where powerful features don't come with a premium price tag.
            </p>
            <Button asChild size="lg" className="h-16 px-10 text-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200">
            <Link href="/auth/sign-up">Join Slot. for Free</Link>
            </Button>
        </section>
        </div>
    </section>
  );
}