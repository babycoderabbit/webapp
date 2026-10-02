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
        "md:hidden fixed bottom-28 left-4 right-4 bg-white border-2 border-black p-4 shadow-[4px_4px_0_0_#000000] z-50 transition-all duration-300 transform origin-bottom",
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
                  "flex flex-col items-center gap-2 p-4 border-2 border-black transition-all hover:bg-black hover:text-white",
                  isActive ? "bg-black text-white" : "bg-white text-black"
                )}
              >
                <Icon size={28} />
                <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
              </Link>
            )
          })}
        </div>
        
        <div className="border-t-4 border-black pt-4 mt-2">
           <Link href="/settings" onClick={() => setMoreOpen(false)} className="flex items-center justify-center gap-2 bg-white text-black hover:bg-black hover:text-white border-2 border-black font-black uppercase text-sm py-3 transition-colors">
             <span>Settings</span>
           </Link>
        </div>
      </div>

      {/* Floating Bottom Nav */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 bg-white border-2 border-black p-2 flex justify-between items-center shadow-[4px_4px_0_0_#000000] z-50">
        {mainNav.map(item => {
          const isActive = pathname?.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link 
              key={item.href}
              href={item.href} 
              onClick={() => setMoreOpen(false)}
              className={cn(
                "p-3 transition-all duration-300 flex flex-col items-center gap-1 flex-1 border-2 border-transparent",
                isActive ? "text-black border-black bg-black/5" : "text-black hover:bg-black hover:text-white"
              )}
            >
              <Icon size={24} className={cn("transition-transform", isActive && "scale-110")} />
              <span className={cn("text-[9px] font-black uppercase tracking-widest transition-all", isActive ? "opacity-100" : "opacity-0 translate-y-1")}>
                {item.name}
              </span>
            </Link>
          )
        })}
        
        <button 
          onClick={() => setMoreOpen(!moreOpen)}
          className={cn(
            "p-3 transition-all duration-300 flex flex-col items-center gap-1 flex-1 border-2 border-transparent",
            moreOpen ? "text-black border-black bg-black/5" : "text-black hover:bg-black hover:text-white"
          )}
        >
          {moreOpen ? <X size={24} /> : <Menu size={24} />}
          <span className={cn("text-[9px] font-black uppercase tracking-widest transition-all", moreOpen ? "opacity-100" : "opacity-0 translate-y-1")}>
            {moreOpen ? 'Close' : 'More'}
          </span>
        </button>
      </div>
    </>
  )
}
