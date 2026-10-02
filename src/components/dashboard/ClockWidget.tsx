'use client'
import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

export function ClockWidget() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col items-end">
      <div suppressHydrationWarning className="text-4xl md:text-5xl font-black tracking-tighter text-foreground tabular-nums">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div suppressHydrationWarning className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-widest mt-1 bg-primary/10 px-3 py-1 rounded-full">
        <Clock size={12} />
        {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
      </div>
    </div>
  )
}
