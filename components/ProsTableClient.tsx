'use client'

import { useState } from 'react'
import ProActions from "@/components/pros/ProActions"
import { Briefcase } from "lucide-react"

export function ProsTableClient({ professionals }: { professionals: any[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  const totalPages = Math.ceil(professionals.length / rowsPerPage)
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentPros = professionals.slice(indexOfFirstRow, indexOfLastRow)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Professional</th>
            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Full Name</th>
            <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {currentPros.map((pro) => (
            <tr key={pro.id} className="hover:bg-blue-50/30 transition-colors group">
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-slate-200">
                    {pro.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">@{pro.username}</div>
                    <div className="text-[10px] text-blue-600 font-black uppercase tracking-wider">Verified Pro</div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <p className="text-sm font-semibold text-slate-700">{pro.first_name} {pro.last_name}</p>
                <p className="text-xs text-slate-400 font-medium">{pro.phone || "No phone provided"}</p>
              </td>
              <td className="px-8 py-6 text-right">
                <ProActions pro={pro} /> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION FOOTER */}
      {professionals.length > rowsPerPage && (
        <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <p className="text-xs font-bold text-slate-500">
            Showing <span className="text-slate-900">{indexOfFirstRow + 1}</span> to{' '}
            <span className="text-slate-900">{Math.min(indexOfLastRow, professionals.length)}</span> of{' '}
            <span className="text-slate-900">{professionals.length}</span> professionals
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
            >
              Prev
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                  currentPage === i + 1 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {professionals.length === 0 && (
        <div className="px-8 py-20 text-center">
          <Briefcase className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No professionals found.</p>
        </div>
      )}
    </div>
  )
}