"use client";

import { useState } from "react";
import { Trash2, AlertCircle, X } from "lucide-react";
import { deleteBooking } from "@/app/dashboard/actions"; // Assumes you have this action

export default function DeleteBookingButton({ id, guestName }: { id: string, guestName: string }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      {/* THE TRIGGER BUTTON */}
      <button 
        type="button" 
        onClick={() => setShowConfirm(true)}
        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-4 rounded-2xl font-bold hover:bg-red-100 transition-all border border-red-100"
      >
        <Trash2 size={18} />
        Cancel Appointment
      </button>

      {/* THE MODAL OVERLAY */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          
          {/* THE MODAL CARD */}
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl shadow-slate-900/20 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                <AlertCircle size={30} />
              </div>
              <button 
                onClick={() => setShowConfirm(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Cancel this booking?
            </h3>
            <p className="text-slate-500 leading-relaxed mb-8">
              You are about to cancel the appointment for <strong className="text-slate-900">{guestName}</strong>. 
              This will remove the slot from your calendar and notify the guest. This action cannot be undone.
            </p>

            <div className="flex flex-col gap-3">
              {/* ACTUAL DELETE ACTION */}
              <form action={() => deleteBooking(id)}>
                <button 
                  type="submit" 
                  className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
                >
                  Confirm Cancellation
                </button>
              </form>
              
              <button 
                onClick={() => setShowConfirm(false)}
                className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Nevermind, keep it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}