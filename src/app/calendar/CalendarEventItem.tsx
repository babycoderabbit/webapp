'use client';
import { CalendarEvent } from '@prisma/client';
import { useState } from 'react'
import { Trash2, Edit2, Calendar as CalendarIcon } from 'lucide-react'
import { updateCalendarEvent, deleteCalendarEvent } from '@/app/actions/calendar'

export function CalendarEventItem({ event }: { event: CalendarEvent }) {
  const [isEditing, setIsEditing] = useState(false)
  
  if (isEditing) {
    return (
      <form action={async (formData) => {
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const startDateStr = formData.get('startDate') as string
        const endDateStr = formData.get('endDate') as string
        const isHoliday = formData.get('isHoliday') === 'on'
        await updateCalendarEvent(event.id, title, description, startDateStr, endDateStr, isHoliday)
        setIsEditing(false)
      }} className="flex flex-col gap-3 p-4 bg-white border border-black shadow-lg">
        <input type="text" name="title" defaultValue={event.title} required className="border border-black p-2 font-bold focus:outline-none" />
        <input type="text" name="description" defaultValue={event.description || ''} placeholder="Description" className="border border-black p-2 font-bold focus:outline-none" />
        <div className="flex flex-col sm:flex-row gap-2">
          <input type="date" name="startDate" defaultValue={new Date(event.startDate).toISOString().split('T')[0]} required className="border border-black p-2 font-bold focus:outline-none flex-1 min-w-0" />
          <input type="date" name="endDate" defaultValue={new Date(event.endDate).toISOString().split('T')[0]} required className="border border-black p-2 font-bold focus:outline-none flex-1 min-w-0" />
        </div>
        <label className="flex items-center gap-2 font-black uppercase text-sm cursor-pointer">
          <input type="checkbox" name="isHoliday" defaultChecked={event.isHoliday} className="w-5 h-5 accent-black border border-black cursor-pointer" />
          Is Holiday
        </label>
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-black text-white px-4 py-2 font-black uppercase border border-black hover:bg-white hover:text-black transition-colors cursor-pointer">Save</button>
          <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white text-black font-black uppercase border border-black hover:bg-black hover:text-white transition-colors cursor-pointer">Cancel</button>
        </div>
      </form>
    )
  }

  return (
    <div className={`p-4 border border-black hover:translate-x-1 hover:-translate-y-1 hover:shadow-lg transition-all group ${event.isHoliday ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col min-w-0 w-full">
          <div className="flex items-center gap-2 flex-wrap">
            <CalendarIcon size={18} className="flex-shrink-0" />
            <span className="font-black text-lg uppercase break-words">{event.title}</span>
            {event.isHoliday && <span className={`text-[10px] font-black uppercase tracking-widest border px-2 py-1 flex-shrink-0 ${event.isHoliday ? 'border-white' : 'border-black'}`}>Holiday</span>}
          </div>
          <span className="text-xs font-bold tracking-widest mt-1 break-words" suppressHydrationWarning>
            {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
          </span>
          {event.description && <span className="text-sm font-bold mt-2 break-words">{event.description}</span>}
        </div>
        <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity self-end sm:self-auto flex-shrink-0">
          <button onClick={() => setIsEditing(true)} className={`p-2 border transition-colors cursor-pointer ${event.isHoliday ? 'border-white hover:bg-white hover:text-black' : 'border-black hover:bg-black hover:text-white'}`}><Edit2 size={16}/></button>
          <form action={async () => { await deleteCalendarEvent(event.id) }}>
            <button type="submit" className={`p-2 border transition-colors cursor-pointer ${event.isHoliday ? 'border-white hover:bg-white hover:text-black' : 'border-black hover:bg-black hover:text-white'}`}><Trash2 size={16}/></button>
          </form>
        </div>
      </div>
    </div>
  )
}
