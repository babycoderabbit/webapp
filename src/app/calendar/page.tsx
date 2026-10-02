import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { createCalendarEvent } from '@/app/actions/calendar'
import { Calendar as CalendarIcon, Plus } from 'lucide-react'
import { CalendarEventItem } from './CalendarEventItem'

export default async function CalendarPage() {
  const session = await auth()
  let userId = session?.user?.id
  if (!userId) {
    const firstUser = await prisma.user.findFirst()
    if (firstUser) userId = firstUser.id
    else redirect('/login')
  }

  const events = await prisma.calendarEvent.findMany({ 
    where: { userId }, 
    orderBy: { startDate: 'asc' } 
  })

  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-8 max-w-4xl mx-auto bg-white text-black min-h-screen">
      <header className="border-4 border-black p-6 md:p-8 bg-white shadow-[8px_8px_0_0_#000000]">
        <div className="flex items-center gap-3 font-black tracking-widest uppercase text-xs mb-3">
          <CalendarIcon size={24} /> Planning
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Calendar</h1>
        <p className="font-bold mt-2 uppercase tracking-widest text-sm text-black">Manage your events and holidays.</p>
      </header>

      <div className="border-4 border-black bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#000000]">
        <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
          <Plus size={28} />
          <h2 className="text-2xl font-black tracking-tighter uppercase">Add Event</h2>
        </div>
        
        <form action={async (formData) => { 'use server'; await createCalendarEvent(formData) }} className="mb-6 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <input type="text" name="title" required placeholder="Event Title" className="border-4 border-black p-3 text-sm font-bold flex-1 min-w-0 focus:outline-none" />
            <input type="text" name="description" placeholder="Optional Description" className="border-4 border-black p-3 text-sm font-bold flex-1 min-w-0 focus:outline-none" />
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <input type="date" name="startDate" required className="border-4 border-black p-3 text-sm font-bold flex-1 min-w-0 focus:outline-none" />
            <input type="date" name="endDate" required className="border-4 border-black p-3 text-sm font-bold flex-1 min-w-0 focus:outline-none" />
          </div>
          <label className="flex items-center gap-2 font-black uppercase text-sm cursor-pointer w-fit">
            <input type="checkbox" name="isHoliday" className="w-5 h-5 accent-black border-4 border-black cursor-pointer" />
            Is Holiday
          </label>
          <button type="submit" className="w-full bg-black text-white px-6 py-4 font-black uppercase border-4 border-black hover:bg-white hover:text-black transition-all cursor-pointer">Save Event</button>
        </form>
      </div>

      <div className="border-4 border-black bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#000000]">
        <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
          <CalendarIcon size={28} />
          <h2 className="text-2xl font-black tracking-tighter uppercase">Upcoming Events</h2>
        </div>
        
        <div className="space-y-4">
          {events.length === 0 ? (
             <div className="text-sm font-bold text-center py-6 border-4 border-black uppercase tracking-widest">No events scheduled.</div>
          ) : (
            events.map(event => (
              <CalendarEventItem key={event.id} event={event} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
