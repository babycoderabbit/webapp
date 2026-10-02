'use client';
import { Habit } from '@prisma/client';

import { useState } from 'react'
import { Trash2, Edit2, Check, X } from 'lucide-react'

export function HabitItem({ habit, todayLog, onLog, onDelete, onEdit }: { habit: Habit, todayLog: string | undefined, onLog: (id: string, s: string) => void, onDelete: (id: string) => void, onEdit: (id: string, t: string, tod: string) => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(habit.title)
  const [timeOfDay, setTimeOfDay] = useState(habit.timeOfDay)

  const handleSave = async () => {
    await onEdit(habit.id, title, timeOfDay)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-black rounded-none gap-4 bg-white">
        <div className="flex-1 w-full flex flex-col gap-2">
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="border border-black p-2 text-sm font-bold w-full bg-white text-black outline-none"
          />
          <select 
            value={timeOfDay} 
            onChange={(e) => setTimeOfDay(e.target.value)}
            className="border border-black p-2 text-sm font-bold w-full bg-white text-black outline-none"
          >
            <option value="MORNING">Morning</option>
            <option value="AFTERNOON">Afternoon</option>
            <option value="EVENING">Evening</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="p-2 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><Check size={18} /></button>
          <button onClick={() => setIsEditing(false)} className="p-2 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><X size={18} /></button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-black rounded-none hover:translate-x-1 hover:-translate-y-1 hover:shadow-lg transition-all gap-4 bg-white">
      <div className="flex gap-3 items-center">
        <button onClick={() => onDelete(habit.id)} className="p-2 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><Trash2 size={16}/></button>
        <button onClick={() => setIsEditing(true)} className="p-2 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><Edit2 size={16}/></button>
        <span className="font-bold text-black text-sm md:text-base uppercase tracking-wider">{habit.title}</span>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <button 
          onClick={() => onLog(habit.id, 'COMPLETED')}
          disabled={todayLog === 'COMPLETED'} 
          className={`flex-1 sm:flex-none px-6 py-2 text-xs font-black uppercase tracking-widest border border-black transition-all cursor-pointer ${todayLog === 'COMPLETED' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'}`}
        >
          Done
        </button>
        <button 
          onClick={() => onLog(habit.id, 'SKIPPED')}
          disabled={todayLog === 'SKIPPED'} 
          className={`flex-1 sm:flex-none px-6 py-2 text-xs font-black uppercase tracking-widest border border-black transition-all cursor-pointer ${todayLog === 'SKIPPED' ? 'opacity-50 line-through bg-white text-black' : 'bg-white text-black hover:bg-black hover:text-white'}`}
        >
          Skip
        </button>
      </div>
    </div>
  )
}
