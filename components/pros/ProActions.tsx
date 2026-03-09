"use client";

import { useState } from "react";
import { Settings2, ExternalLink, Trash2, Archive, ShieldOff, MoreHorizontal, X, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { deletePro, updateProStatus } from "@/app/dashboard/actions"; // We'll create these actions

export default function ProActions({ pro }: { pro: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"delete" | "archive" | "block" | null>(null);

  const closeModals = () => {
    setModalType(null);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-end gap-2 relative">
      {/* Primary Actions */}
      <Link 
        href={`/${pro.username}`} 
        target="_blank" 
        className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
        title="View Page"
      >
        <ExternalLink size={18} />
      </Link>

      {/* More Actions Dropdown Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-xl transition-all ${isOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-900'}`}
      >
        <MoreHorizontal size={18} />
      </button>

      {/* Custom Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-14 w-48 bg-white border border-slate-100 shadow-xl rounded-2xl p-2 z-20 animate-in fade-in slide-in-from-top-2">
            <button onClick={() => setModalType("archive")} className="flex items-center gap-3 w-full p-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <Archive size={16} /> Archive
            </button>
            <button onClick={() => setModalType("block")} className="flex items-center gap-3 w-full p-3 text-sm font-semibold text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
              <ShieldOff size={16} /> Block Access
            </button>
            <div className="h-px bg-slate-50 my-1" />
            <button onClick={() => setModalType("delete")} className="flex items-center gap-3 w-full p-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 size={16} /> Delete Pro
            </button>
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {modalType && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
              modalType === 'delete' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
            }`}>
              <AlertTriangle size={28} />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 capitalize mb-2">{modalType} Professional?</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Are you sure you want to {modalType} <strong>@{pro.username}</strong>? 
              {modalType === 'delete' && " This action is permanent."}
            </p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={async () => {
                   if(modalType === 'delete') await deletePro(pro.id);
                   else await updateProStatus(pro.id, modalType);
                   closeModals();
                }}
                className={`w-full py-4 rounded-2xl font-bold text-white transition-all ${
                  modalType === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                Confirm {modalType}
              </button>
              <button onClick={closeModals} className="w-full py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}