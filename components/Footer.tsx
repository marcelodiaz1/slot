"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Twitter, Github, Linkedin, Mail, ArrowRight } from 'lucide-react';

const FOOTER_LINKS = {
  product: [
    { name: "Features", href: "/product" },
    { name: "Integrations", href: "/integrations" },
    { name: "Pricing", href: "/pricing" },
    { name: "Changelog", href: "/changelog" },
  ],
  comparisons: [
    { name: "vs. Calendly", href: "/compare" },
    { name: "vs. Acuity", href: "/compare" },
    { name: "vs. TidyCal", href: "/compare" },
    { name: "vs. Doodle", href: "/compare" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group w-fit">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
                <span className="text-white font-black text-xl">S</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Slot<span className="text-blue-600">.</span>
              </span>
            </Link>
            <p className="text-slate-500 text-lg max-w-sm mb-8">
              The premium scheduling infrastructure for the gig economy. Built for freelancers who value their time and their bottom line.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <Link key={i} href="#" className="p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Product</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-500 hover:text-blue-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Compare</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.comparisons.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-500 hover:text-blue-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-500 hover:text-blue-600 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm italic">
            © 2026 Slot. All rights reserved. Built for those who hustle.
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Status: Fully Operational
          </div>
        </div>
      </div>
    </footer>
  );
}