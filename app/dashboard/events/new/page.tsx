'use client'
import { createSlot } from "@/app/dashboard/actions"

export default function NewSlotPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white border rounded-2xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Create a New Event Type</h1>
      <form action={createSlot} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Event Name</label>
          <input name="title" placeholder="e.g. 15 Min Discovery" className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Slug (URL path)</label>
          <input name="slug" placeholder="15-min-chat" className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Duration (minutes)</label>
          <input name="duration" type="number" defaultValue="15" className="w-full p-2 border rounded" required />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold">
          Create Event
        </button>
      </form>
    </div>
  )
}