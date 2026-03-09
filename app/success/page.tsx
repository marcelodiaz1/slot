'use client'

import Link from 'next/link'
import { CheckCircle2, Zap, History, Bell, ArrowRight, Printer } from 'lucide-react'

export default function SuccessPage() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print()
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        
        {/* LEFT SIDE: Confirmation details */}
        <div className="p-10 md:p-14 flex flex-col justify-center text-center lg:text-left border-b lg:border-b-0 lg:border-r border-slate-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner mx-auto lg:mx-0">
            <CheckCircle2 size={40} strokeWidth={3} />
          </div>

          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Booking Confirmed!
          </h1>
          <p className="text-slate-500 mb-8 text-lg leading-relaxed">
            Your appointment is set. Check your inbox for the calendar invite and meeting link.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handlePrint}
              className="flex-1 py-4 px-6 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <Printer size={18} /> Print Ticket
            </button>
            <Link 
              href="/"
              className="flex-1 py-4 px-6 bg-white border-2 border-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE: The Upsell / Registration Hook */}
        <div className="p-10 md:p-14 bg-blue-600 text-white flex flex-col justify-center relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl" />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-8 leading-tight">
              Tired of filling out forms? <br/>
              <span className="text-blue-200">Unlock your Personal Dashboard.</span>
            </h2>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Zap size={20} className="text-blue-100" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">1-Click Bookings</h4>
                  <p className="text-blue-100 text-sm">Save your details once and skip the forms forever.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <History size={20} className="text-blue-100" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Full Session History</h4>
                  <p className="text-blue-100 text-sm">Access your notes, past appointments, and receipts.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Bell size={20} className="text-blue-100" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Manage & Reschedule</h4>
                  <p className="text-blue-100 text-sm">Cancel or move meetings with a single tap from your portal.</p>
                </div>
              </div>
            </div>

            <Link 
              href="/register"
              className="group block w-full py-5 bg-white text-blue-600 font-black text-center rounded-[2rem] shadow-xl shadow-blue-900/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              Create My Free Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <p className="text-center mt-6 text-blue-200 text-xs font-bold uppercase tracking-widest">
              Join 1,000+ happy clients
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}