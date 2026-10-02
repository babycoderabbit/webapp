'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CheckSquare, GraduationCap, DollarSign, Menu, X, PenTool, Tv, ShieldCheck, Settings, Calendar } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function MobileNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  const mainNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Habits', href: '/habits', icon: CheckSquare },
    { name: 'Student', href: '/student', icon: GraduationCap },
    { name: 'Money', href: '/money', icon: DollarSign },
  ]

  const moreNav = [
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Writing', href: '/writing', icon: PenTool },
    { name: 'Lazy Mode', href: '/lazy', icon: Tv },
    { name: 'Admin', href: '/admin', icon: ShieldCheck },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <>
      {moreOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-white/80 z-40" 
          onClick={() => setMoreOpen(false)}
        />
      )}

      {/* More Menu Drawer */}
      <div className={cn(
        "md:hidden fixed bottom-28 left-4 right-4 bg-white/95 backdrop-blur-lg border border-black/10 p-5 shadow-2xl rounded-[2rem] z-50 transition-all duration-300 transform origin-bottom",
        moreOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-10 pointer-events-none"
      )}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {moreNav.map(item => {
            const isActive = pathname?.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMoreOpen(false)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 border border-black/10 rounded-2xl transition-all hover:bg-black/5 hover:border-black/20",
                  isActive ? "bg-black text-white" : "bg-white text-black"
                )}
              >
                <Icon size={28} />
                <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
              </Link>
            )
          })}
        </div>
        
        <div className="border-t border-black/10 pt-4 mt-2">
           <Link href="/settings" onClick={() => setMoreOpen(false)} className="flex items-center justify-center gap-2 bg-black/5 text-black hover:bg-black/10 border border-transparent rounded-xl font-black uppercase text-sm py-3 transition-colors">
             <span>Settings</span>
           </Link>
        </div>
      </div>

      {/* Floating Bottom Nav */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 bg-white/95 backdrop-blur-lg border border-black/10 p-2 flex justify-between items-center shadow-2xl rounded-full z-50">
        {mainNav.map(item => {
          const isActive = pathname?.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link 
              key={item.href}
              href={item.href} 
              onClick={() => setMoreOpen(false)}
              className={cn(
                "py-2 px-1 transition-all duration-300 flex flex-col items-center gap-1 flex-1 min-w-0 rounded-full",
                isActive ? "text-black bg-black/10" : "text-black/60 hover:text-black hover:bg-black/5"
              )}
            >
              <Icon size={22} className={cn("transition-transform flex-shrink-0", isActive && "scale-110")} />
              <span className={cn("text-[9px] font-black uppercase tracking-widest transition-all truncate w-full text-center", isActive ? "opacity-100" : "opacity-0 translate-y-1")}>
                {item.name}
              </span>
            </Link>
          )
        })}
        
        <button 
          onClick={() => setMoreOpen(!moreOpen)}
          className={cn(
            "py-2 px-1 transition-all duration-300 flex flex-col items-center gap-1 flex-1 min-w-0 rounded-full",
            moreOpen ? "text-black bg-black/10" : "text-black/60 hover:text-black hover:bg-black/5"
          )}
        >
          {moreOpen ? <X size={22} className="flex-shrink-0" /> : <Menu size={22} className="flex-shrink-0" />}
          <span className={cn("text-[9px] font-black uppercase tracking-widest transition-all truncate w-full text-center", moreOpen ? "opacity-100" : "opacity-0 translate-y-1")}>
            {moreOpen ? 'Close' : 'More'}
          </span>
        </button>
      </div>
    </>
  )
}
