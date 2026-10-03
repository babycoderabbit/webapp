import { ClockWidget } from '@/components/dashboard/ClockWidget'
import { QuoteWidget } from '@/components/dashboard/QuoteWidget'
import { QuickCapture } from '@/components/dashboard/QuickCapture'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { deleteTask } from '@/app/actions/index'
import { Trash2, Calendar as CalendarIcon, Target, CheckCircle2, Activity } from 'lucide-react'

export default async function DashboardPage() {
  const session = await auth()
  let userId = session?.user?.id
  if (!userId) {
    const firstUser = await prisma.user.findFirst()
    if (firstUser) userId = firstUser.id
    else redirect('/login')
  }

  const tasks = await prisma.task.findMany({
    where: { userId, status: { not: 'COMPLETED' } },
    take: 5
  })

  const habits = await prisma.habit.findMany({
    where: { userId, isActive: true }
  })

  const user = await prisma.user.findUnique({ where: { id: userId } })

  // Fetch today's schedule
  const today = new Date()
  const dayOfWeekIndex = (today.getDay() + 6) % 7
  
  const todayClasses = await prisma.timetableSlot.findMany({
    where: { userId, dayOfWeek: dayOfWeekIndex },
    include: { course: true },
    orderBy: { startTime: 'asc' }
  })

  // Start of today and end of today for calendar events
  const startOfDay = new Date(today.setHours(0,0,0,0))
  const endOfDay = new Date(today.setHours(23,59,59,999))
  
  const todayEvents = await prisma.calendarEvent.findMany({
    where: { 
      userId,
      startDate: { lte: endOfDay },
      endDate: { gte: startOfDay }
    },
    orderBy: { startDate: 'asc' }
  })

  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto bg-white text-black min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10 border border-black p-6 md:p-8 shadow-lg bg-white">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="font-bold text-sm md:text-base uppercase tracking-widest">Your personal command center is ready.</p>
        </div>
        <ClockWidget />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <QuoteWidget />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div id="tasks" className="border border-black p-6 shadow-lg bg-white">
              <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
                <Target size={28} />
                <h3 className="text-2xl font-black tracking-tighter uppercase">Active Tasks</h3>
              </div>
              
              {tasks.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-6 font-bold border border-black">
                   <CheckCircle2 size={32} className="mb-2" />
                   <p className="text-sm uppercase tracking-widest">All caught up!</p>
                 </div>
              ) : (
                <ul className="space-y-4">
                  {tasks.map(task => (
                    <li key={task.id} className="group flex justify-between items-center p-3 border border-black bg-white hover:translate-x-1 hover:-translate-y-1 hover:shadow-lg transition-all">
                      <span className="text-sm font-black uppercase">{task.title}</span>
                      <div className="flex gap-3 items-center">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 border border-black">
                          {task.priority}
                        </span>
                        <form action={async () => { 'use server'; await deleteTask(task.id) }}>
                          <button className="p-2 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"><Trash2 size={16}/></button>
                        </form>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border border-black p-6 shadow-lg bg-white h-fit">
              <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
                <CalendarIcon size={28} />
                <h3 className="text-2xl font-black tracking-tighter uppercase">Today&apos;s Schedule</h3>
              </div>
              
              {todayClasses.length === 0 && todayEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 font-bold border border-black text-center">
                  <p className="text-sm uppercase tracking-widest px-2">No imminent classes or events.<br/>Enjoy your free time.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayClasses.map(slot => (
                    <div key={slot.id} className="p-3 border border-black bg-white flex flex-col gap-1 hover:translate-x-1 hover:-translate-y-1 hover:shadow-lg transition-all">
                      <div className="flex justify-between items-center">
                        <span className="font-black uppercase">{slot.course.code}</span>
                        <span className="text-xs font-bold tracking-widest border border-black px-2 py-1">{slot.startTime} - {slot.endTime}</span>
                      </div>
                      <span className="text-xs font-bold tracking-widest">{slot.roomOrLink || 'TBA'}</span>
                    </div>
                  ))}
                  {todayEvents.map(event => (
                    <div key={event.id} className="p-3 border border-black bg-black text-white flex flex-col gap-1 hover:translate-x-1 hover:-translate-y-1 hover:shadow-lg hover:shadow-black transition-all">
                      <div className="flex justify-between items-center">
                        <span className="font-black uppercase">{event.title}</span>
                        {event.isHoliday && <span className="text-[10px] font-black uppercase tracking-widest border border-white px-2 py-1">Holiday</span>}
                      </div>
                      <span className="text-xs font-bold tracking-widest">{event.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <QuickCapture />
          
          <div className="border border-black p-6 shadow-lg bg-white">
             <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
                <Activity size={28} />
                <h3 className="text-2xl font-black tracking-tighter uppercase">Daily Routines</h3>
              </div>
            {habits.length === 0 ? (
               <div className="font-bold text-sm text-center py-4 border border-black uppercase tracking-widest">No habits configured.</div>
            ) : (
              <ul className="space-y-4">
                {habits.map(habit => (
                  <li key={habit.id} className="flex justify-between items-center bg-white border border-black p-3 hover:bg-black hover:text-white transition-colors cursor-default">
                    <span className="font-black uppercase text-sm">{habit.title}</span>
                    <span className="text-xs uppercase tracking-widest font-bold border border-current px-2 py-1">{habit.timeOfDay}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
