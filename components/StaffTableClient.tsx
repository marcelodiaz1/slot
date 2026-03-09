'use client'

import { useState } from 'react'
import ClientsActions from "@/components/clients/ClientsActions"
import { Users, ChevronLeft, ChevronRight } from "lucide-react"

export function StaffTableClient({ 
  staffMembers, 
  brandColor 
}: { 
  staffMembers: any[], 
  brandColor: string 
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  // Pagination calculations
  const totalPages = Math.ceil(staffMembers.length / rowsPerPage)
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentStaff = staffMembers.slice(indexOfFirstRow, indexOfLastRow)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Staff Member</th>
            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Full Name</th>
            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {currentStaff.map((staff) => (
            <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-slate-200"
                    style={{ backgroundColor: brandColor }}
                  >
                    {staff.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">@{staff.username}</div>
                    <div className="text-[10px] font-black uppercase tracking-wider" style={{ color: brandColor }}>
                      Team Staff
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <p className="text-sm font-semibold text-slate-700 capitalize">{staff.first_name} {staff.last_name}</p>
                <p className="text-xs text-slate-400 font-medium">{staff.phone || "No phone provided"}</p>
              </td>
              <td className="px-8 py-6 text-right">
                <ClientsActions client={staff} /> 
              </td>
            </tr>
          ))}
          
          {staffMembers.length === 0 && (
            <tr>
              <td colSpan={3} className="px-8 py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <Users className="w-10 h-10 text-slate-200" />
                  <p className="text-slate-400 font-medium">No team members registered yet.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION FOOTER */}
      {staffMembers.length > rowsPerPage && (
        <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <p className="text-xs font-bold text-slate-500">
            Showing <span className="text-slate-900">{indexOfFirstRow + 1}</span> to{' '}
            <span className="text-slate-900">{Math.min(indexOfLastRow, staffMembers.length)}</span> of{' '}
            <span className="text-slate-900">{staffMembers.length}</span> members
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
            >
              Prev
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                  currentPage === i + 1 
                    ? 'text-white shadow-lg' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                style={currentPage === i + 1 ? { backgroundColor: brandColor, boxShadow: `0 10px 15px -3px ${brandColor}33` } : {}}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}