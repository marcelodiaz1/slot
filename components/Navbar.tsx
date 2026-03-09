"use client";

import Link from 'next/link'
import { AuthButton } from '@/components/auth-button'
import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { name: "Product", href: "/product" },
  { name: "Integrations", href: "/integrations" },
  { name: "Compare", href: "/compare" },
  { name: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6">
            <span className="text-white font-black text-2xl">S</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            Slot<span className="text-blue-600">.</span>
          </span>
        </Link>

        {/* MAIN NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-1 bg-slate-50/50 p-1 rounded-2xl border border-slate-100">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-6 py-2 text-sm font-semibold transition-all rounded-xl ${
                  isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white shadow-sm border border-slate-200 rounded-xl z-0"
                    transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* AUTH ACTIONS */}
        <div className="flex items-center gap-4">
          <Suspense fallback={<div className="w-20 h-10 bg-gray-100 animate-pulse rounded-xl" />}>
            <AuthButton />
          </Suspense>
        </div>
      </div>
    </nav>
  )
}