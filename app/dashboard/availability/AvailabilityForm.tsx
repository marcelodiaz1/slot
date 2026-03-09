'use client'

import { useActionState } from 'react'
import { updateAvailability } from '../actions'

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

// 1. Update the interface to include brandColor
interface AvailabilityFormProps {
  initialData: any[];
  brandColor: string;
}

export default function AvailabilityForm({ initialData, brandColor }: AvailabilityFormProps) {
  const [state, formAction, isPending] = useActionState(updateAvailability, null)

  return (
    <section>      
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900" >Availability</h1>
        <p className="text-slate-500">Set your weekly recurring hours.</p>
      </header>
      <form action={formAction} className="space-y-4">
        {DAYS.map((dayName, index) => {
          const dayConfig = initialData?.find(d => d.day_of_week === index)
          
          return (
            <div key={dayName} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all hover:shadow-md">
              <div className="w-32 flex items-center gap-2">
                <input 
                  type="checkbox" 
                  name={`enabled-${index}`} 
                  defaultChecked={!!dayConfig} 
                  // 2. Style the checkbox with brand color
                  style={{ accentColor: brandColor }}
                  className="w-5 h-5 rounded cursor-pointer"
                />
                <span className="font-bold text-slate-700">{dayName}</span>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="time" 
                  name={`start-${index}`} 
                  defaultValue={dayConfig?.start_time || "09:00"}
                  // 3. Apply brand color to the focus ring
                  style={{ '--tw-ring-color': `${brandColor}33` } as any}
                  className="p-2 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:ring-4 focus:border-slate-400"
                />
                <span className="text-slate-400 font-medium">to</span>
                <input 
                  type="time" 
                  name={`end-${index}`} 
                  defaultValue={dayConfig?.end_time || "17:00"}
                  style={{ '--tw-ring-color': `${brandColor}33` } as any}
                  className="p-2 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:ring-4 focus:border-slate-400"
                />
              </div>
            </div>
          )
        })}

        <div className="pt-6 flex items-center justify-between">
          <div className="flex-1">
            {state?.success && (
              <div className="flex items-center gap-2 text-green-600 animate-in fade-in slide-in-from-left-2">
                <span className="text-sm font-bold">✓ Availability saved!</span>
              </div>
            )}
            {state?.error && <p className="text-red-600 text-sm font-bold">{state.error}</p>}
          </div>

          <button 
            disabled={isPending}
            // 4. Set the background color to the brand color
            style={{ backgroundColor: brandColor }}
            className="px-8 py-3 text-white rounded-2xl font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
          >
            {isPending ? 'Saving...' : 'Save Schedule'}
          </button>
        </div>
      </form>
    </section>
  )
}