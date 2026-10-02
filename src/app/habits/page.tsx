import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { logHabit, deleteHabit, createHabit, updateHabit } from '@/app/actions/habits'
import { Sun, Sunset, Moon, Activity } from 'lucide-react'
import { HabitItem } from './HabitItem'
import { Habit, HabitLog } from '@prisma/client'

const HabitList = ({ habits, title, Icon, todayLogs, handleLog, handleDelete, handleEdit }: { habits: Habit[], title: string, Icon: React.ElementType, todayLogs: HabitLog[], handleLog: (id: string, s: string) => void, handleDelete: (id: string) => void, handleEdit: (id: string, t: string, tod: string) => void }) => (
  <div className="border-4 border-black p-6 bg-white mb-6">
    <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
      <Icon size={32} />
      <h2 className="text-3xl font-black uppercase tracking-tighter">{title}</h2>
    </div>
    
    {habits.length === 0 ? (
      <div className="text-black font-bold uppercase tracking-widest text-sm py-8 text-center border-2 border-black border-dashed">No habits assigned</div>
    ) : (
      <div className="space-y-4">
        {habits.map(h => (
          <HabitItem 
            key={h.id} 
            habit={h} 
            todayLog={todayLogs.find((l: HabitLog) => l.habitId === h.id)?.status}
            onLog={handleLog}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    )}
  </div>
)

export default async function HabitsPage() {
  const session = await auth()
  let userId = session?.user?.id
  if (!userId) {
    const firstUser = await prisma.user.findFirst()
    if (firstUser) userId = firstUser.id
    else redirect('/login')
  }

  const habits = await prisma.habit.findMany({ where: { userId } })
  
  const today = new Date().toISOString().split('T')[0]
  const todayLogs = await prisma.habitLog.findMany({
    where: {
      userId,
      date: today
    }
  })

  const morningHabits = habits.filter(h => h.timeOfDay === 'MORNING')
  const afternoonHabits = habits.filter(h => h.timeOfDay === 'AFTERNOON')
  const eveningHabits = habits.filter(h => h.timeOfDay === 'EVENING')

  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto font-sans bg-white min-h-screen text-black">
      <header className="border-4 border-black p-6 md:p-8 bg-white shadow-[8px_8px_0_0_#000000] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 font-black tracking-widest uppercase text-xs mb-2">
            <Activity size={16} /> Routine
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Habits</h1>
          <p className="font-bold mt-2 uppercase tracking-widest text-sm">Build discipline. Stay hard.</p>
        </div>
        
        <form action={async (formData) => { 'use server'; await createHabit(formData) }} className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
          <input type="text" name="title" required placeholder="New Habit..." className="bg-white border-4 border-black p-3 font-bold focus:outline-none flex-1 min-w-0" />
          <select name="timeOfDay" className="bg-white border-4 border-black p-3 font-bold focus:outline-none min-w-0 cursor-pointer">
            <option value="MORNING">Morning</option>
            <option value="AFTERNOON">Afternoon</option>
            <option value="EVENING">Evening</option>
          </select>
          <button type="submit" className="bg-black text-white px-6 py-3 font-black uppercase border-4 border-black hover:bg-white hover:text-black transition-colors whitespace-nowrap cursor-pointer">
            Add
          </button>
        </form>
      </header>

      <div className="flex flex-col gap-8">
        <HabitList habits={morningHabits} title="Morning" Icon={Sun} todayLogs={todayLogs} handleLog={async (id: string, status: string) => { 'use server'; await logHabit(id, status) }} handleDelete={async (id: string) => { 'use server'; await deleteHabit(id) }} handleEdit={async (id: string, title: string, tod: string) => { 'use server'; await updateHabit(id, title, tod) }} />
        <HabitList habits={afternoonHabits} title="Afternoon" Icon={Sunset} todayLogs={todayLogs} handleLog={async (id: string, status: string) => { 'use server'; await logHabit(id, status) }} handleDelete={async (id: string) => { 'use server'; await deleteHabit(id) }} handleEdit={async (id: string, title: string, tod: string) => { 'use server'; await updateHabit(id, title, tod) }} />
        <HabitList habits={eveningHabits} title="Evening" Icon={Moon} todayLogs={todayLogs} handleLog={async (id: string, status: string) => { 'use server'; await logHabit(id, status) }} handleDelete={async (id: string) => { 'use server'; await deleteHabit(id) }} handleEdit={async (id: string, title: string, tod: string) => { 'use server'; await updateHabit(id, title, tod) }} />
      </div>
    </div>
  )
}
