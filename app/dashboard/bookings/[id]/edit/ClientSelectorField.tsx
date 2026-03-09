'use client'

import { useState } from 'react'
import { ShieldCheck, ChevronDown } from 'lucide-react'

export function ClientSelectorField({ allClients, initialClientId, initialGuestName, initialGuestEmail, viewer }: any) {
  const [isManualEntry, setIsManualEntry] = useState(!initialClientId)
  const [selectedClientId, setSelectedClientId] = useState(initialClientId || "")

  // FILTER & MAP LOGIC
  const filteredClients = allClients.filter((record: any, index: number, self: any[]) => {
    const vId = String(viewer?.id || "").toLowerCase()
    const vParentId = String(viewer?.parent_id || "").toLowerCase()
    const recordDoctorId = String(record.doctor_id || "").toLowerCase()

    let isMatch = false
    if (viewer?.role === 'pro') {
      isMatch = recordDoctorId === vId
    } else if (viewer?.role === 'teammember') {
      // Matches if the booking belongs to the teammember OR their boss
      isMatch = recordDoctorId === vId || recordDoctorId === vParentId
    } else if (viewer?.role === 'admin') {
      isMatch = true
    }

    // Unique by client_id
    return isMatch && self.findIndex(r => String(r.client_id) === String(record.client_id)) === index
  }).map((record: any) => {
    // Transform booking record into a profile-like object
    const names = record.guest_name?.split(' ') || ["Client"]
    return {
      id: record.client_id, 
      first_name: names[0],
      last_name: names.slice(1).join(' '),
      email: record.guest_email
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
          Client Selection
        </label> 
      </div>

      {!isManualEntry ? (
        <div className="space-y-4">
          <div className="relative">
            <select 
              name="client_id" 
              required 
              value={selectedClientId} 
              onChange={(e) => setSelectedClientId(e.target.value)} 
              className="w-full h-14 pl-5 pr-10 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="">Choose a registered client ({filteredClients.length})...</option>
              {filteredClients.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.first_name} {c.last_name} ({c.email})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          </div>
          
          {selectedClientId && (
            <div className="animate-in fade-in slide-in-from-top-1">
              {(() => {
                const c = filteredClients.find((u: any) => String(u.id) === String(selectedClientId));
                return (
                  <>
                    <input type="hidden" name="guest_name" value={`${c?.first_name || ""} ${c?.last_name || ""}`} />
                    <input type="hidden" name="guest_email" value={c?.email || ""} />
                    <div className="flex items-center gap-2 text-[10px] bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl font-black uppercase tracking-tighter border border-emerald-100">
                      <ShieldCheck size={14} /> Auto-Syncing details for {c?.first_name}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-3 animate-in fade-in zoom-in-95 duration-200">
          <input name="guest_name" type="text" defaultValue={initialGuestName} required placeholder="Guest Full Name" className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 placeholder:text-slate-300" />
          <input name="guest_email" type="email" defaultValue={initialGuestEmail} required placeholder="Guest Email Address" className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 placeholder:text-slate-300" />
          <input type="hidden" name="client_id" value="" />
        </div>
      )}
    </div>
  )
}