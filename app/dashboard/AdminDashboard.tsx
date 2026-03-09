'use client'
import { useState, useEffect } from 'react'
import { Users, Calendar, Clock, ArrowUpRight, Award, Plus, Video, ExternalLink } from "lucide-react"
import Link from 'next/link'

interface AdminProps {
  bookings: any[]
  user: any
  stats: { pros: number, clients: number }
}

export function AdminDashboard({ bookings, user, stats }: AdminProps) {
  const [mounted, setMounted] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Brand color logic - Fallback to blue if user profile doesn't have it
  const brandColor = user?.brand_color || '#2563eb'

  useEffect(() => {
    setMounted(true)
  }, [])

  // Pagination Logic
  const rowsPerPage = 10 
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentBookings = bookings.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(bookings.length / rowsPerPage)
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const totalBookings = bookings.length
  const upcomingBookings = bookings.filter(b => new Date(b.start_time) > new Date()).length

  const statCards = [
    { label: 'Total Appointments', value: totalBookings, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Upcoming Sessions', value: upcomingBookings, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Professionals', value: stats.pros, icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Clients', value: stats.clients, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
             Admin <span style={{ color: brandColor }}>Console</span>
          </h1>
          <p className="text-slate-500 font-medium">System Overview for {user?.first_name || 'Administrator'}</p> 
        </div>
        
        <Link 
          href="/dashboard/bookings/new" 
          style={{ backgroundColor: brandColor }} 
          className="text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-100 transition-all active:scale-95 hover:opacity-90"
        >
          <Plus size={20} /> New Appointment
        </Link>
      </header> 

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-tight">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-900">Global Appointments</h2>
          <span className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">{totalBookings} Total Rows</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[11px] font-black uppercase text-slate-400">Guest</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase text-slate-400">Professional</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase text-slate-400">Time</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase text-slate-400">Meeting</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase text-slate-400">Status</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-900 capitalize">{b.guest_name}</p>
                    <p className="text-[10px] text-slate-400">{b.guest_email}</p>
                  </td>

                  <td className="px-8 py-5 text-sm font-bold text-slate-600">
                    {b.doctor ? (
                      <span className="capitalize">{b.doctor.first_name} {b.doctor.last_name}</span>
                    ) : (
                      <span className="text-slate-400 italic font-normal">Unassigned</span>
                    )}
                  </td>

                  <td className="px-8 py-5 text-sm text-slate-500">
                    {mounted ? (
                      <>
                        {new Date(b.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {' '}
                        {new Date(b.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </>
                    ) : (
                      <span className="animate-pulse">...</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    {b.meeting_link ? (
                      <a 
                        href={b.meeting_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ backgroundColor: `${brandColor}15`, color: brandColor }}
                        className="flex items-center w-fit gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all border border-transparent hover:border-current"
                      >
                        <Video size={14} />
                        Join Link
                        <ExternalLink size={10} className="opacity-50" />
                      </a>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                        <Users size={14} className="opacity-30" />
                        In-Person
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <span 
                      className="px-3 py-1 text-[10px] font-black uppercase rounded-full"
                      style={{ backgroundColor: `${brandColor}15`, color: brandColor }}
                    >
                      {b.status || 'Confirmed'}
                    </span>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <Link href={`/dashboard/bookings/${b.id}/edit`} className="p-2 inline-block bg-slate-100 rounded-lg hover:bg-slate-900 hover:text-white transition-all">
                      <ArrowUpRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
            <p className="text-xs font-bold text-slate-500">
              Showing <span className="text-slate-900">{indexOfFirstRow + 1}</span> to{' '}
              <span className="text-slate-900">{Math.min(indexOfLastRow, totalBookings)}</span> of {totalBookings}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                Prev
              </button>
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}