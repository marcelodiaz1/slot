'use client'

import { deleteBooking } from './actions'
import { useState, useTransition } from 'react'

export default function CancelButton({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    if (confirm('Are you sure you want to cancel this booking? This cannot be undone.')) {
      startTransition(async () => {
        await deleteBooking(bookingId)
      })
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className={`text-sm font-medium transition-colors ${
        isPending ? 'text-gray-400' : 'text-red-500 hover:text-red-700'
      }`}
    >
      {isPending ? 'Cancelling...' : 'Cancel'}
    </button>
  )
}