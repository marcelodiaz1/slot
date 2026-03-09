'use client'

import { useState } from 'react'
import ClientsActions from "@/components/clients/ClientsActions"
import { Briefcase, Mail, UserPlus, MoreHorizontal } from "lucide-react"

export function ClientTable({ clients, brandColor }: { clients: any[], brandColor: string }) {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  const totalPages = Math.ceil(clients.length / rowsPerPage)
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentClients = clients.slice(indexOfFirstRow, indexOfLastRow)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Client Status</th>
            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Full Name</th>
            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {currentClients.map((client) => {
            const isAnonymous = client.isGuest || !client.username;
            
            return (
              <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                {/* 1. STATUS COLUMN */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg transition-transform group-hover:scale-110"
                      style={{ backgroundColor: isAnonymous ? '#94a3b8' : brandColor }}
                    >
                      {isAnonymous ? <Briefcase size={20} /> : client.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">
                        {isAnonymous ? "Guest Session" : `@${client.username}`}
                      </div>
                      <div 
                        className="text-[10px] font-black uppercase tracking-wider" 
                        style={{ color: isAnonymous ? '#64748b' : brandColor }}
                      >
                        {isAnonymous ? "Anonymous Guest" : "Verified Client"}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. NAME/INFO COLUMN */}
                <td className="px-8 py-6">
                  <p className="text-sm font-semibold text-slate-700 capitalize">
                    {client.first_name} {client.last_name}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    {client.email || "No email provided"}
                  </p>
                </td>

                {/* 3. CONDITIONAL ACTIONS COLUMN */}
                <td className="px-8 py-6 text-right">
                  {isAnonymous ? (
                    <div className="flex justify-end gap-3 items-center">
                      {/* Contact Guest - Always Visible */}
                      <a 
                        href={`mailto:${client.email}`}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 border border-slate-200 transition-all active:scale-95"
                        title="Send Email"
                      >
                        <Mail size={14} />
                        <span className="text-[10px] font-black uppercase tracking-tight">Contact</span>
                      </a>

                      {/* Invite/Convert - Always Visible */}
                      <button 
                        onClick={() => alert('Invite feature coming soon!')}
                        className="p-2 bg-white text-slate-400 border border-slate-200 rounded-xl hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all active:scale-95"
                        title="Invite to Register"
                      >
                        <UserPlus size={16} />
                      </button>
                    </div>
                  ) : (
                    /* Standard management actions for registered clients */
                    <ClientsActions client={client} /> 
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
       
      {/* Pagination Controls */}
      <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
        <p className="text-xs font-bold text-slate-500">
          Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, clients.length)} of {clients.length}
        </p>
        <div className="flex gap-2">
          <button 
            disabled={currentPage === 1} 
            onClick={() => paginate(currentPage - 1)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black hover:bg-slate-50 disabled:opacity-50"
          >
            Prev
          </button>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => paginate(currentPage + 1)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black hover:bg-slate-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}