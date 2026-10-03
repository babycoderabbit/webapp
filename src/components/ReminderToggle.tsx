'use client'
import { useState, useEffect } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { Task, Habit } from '@prisma/client'

export function ReminderToggle({ tasks, habits }: { tasks: Task[], habits: Habit[] }) {
  const [enabled, setEnabled] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    setEnabled(localStorage.getItem('reminders_enabled') === 'true')
  }, [])
  
  useEffect(() => {
    if (!enabled) return
    const interval = setInterval(() => {
       const now = new Date()
       
       tasks.forEach(task => {
         if (task.dueDate) {
            const due = new Date(task.dueDate)
            if (due.getHours() === now.getHours() && due.getMinutes() === now.getMinutes()) {
               if (Notification.permission === 'granted') {
                 new Notification('Task Reminder', { body: task.title })
               }
            }
         }
       })
       
       habits.forEach(habit => {
         let hour = 9 // MORNING
         if (habit.timeOfDay === 'AFTERNOON') hour = 14
         if (habit.timeOfDay === 'EVENING') hour = 20
         
         if (now.getHours() === hour && now.getMinutes() === 0) {
            if (Notification.permission === 'granted') {
               new Notification('Habit Reminder', { body: "Time for: " + habit.title })
            }
         }
       })
       
    }, 60000) // check every minute
    return () => clearInterval(interval)
  }, [enabled, tasks, habits])

  const toggle = async () => {
    if (!enabled) {
      const p = await Notification.requestPermission()
      if (p === 'granted') {
         localStorage.setItem('reminders_enabled', 'true')
         setEnabled(true)
      } else {
         alert('Notification permission denied')
      }
    } else {
      localStorage.setItem('reminders_enabled', 'false')
      setEnabled(false)
    }
  }

  if (!mounted) return null;

  return (
    <button onClick={toggle} className="p-2 border border-black bg-white text-black hover:bg-black hover:text-white transition-colors cursor-pointer flex items-center gap-2 font-bold uppercase tracking-widest text-xs" title="Toggle Reminders">
      {enabled ? <Bell size={16}/> : <BellOff size={16}/>}
      <span className="hidden sm:inline">{enabled ? 'Reminders On' : 'Reminders Off'}</span>
    </button>
  )
}
