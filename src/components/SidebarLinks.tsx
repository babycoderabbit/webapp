'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CheckSquare, GraduationCap, PenTool, Tv, DollarSign, Settings, ShieldCheck, Calendar } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function SidebarLinks() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Habits', href: '/habits', icon: CheckSquare },
    { name: 'Student', href: '/student', icon: GraduationCap },
    { name: 'Writing', href: '/writing', icon: PenTool },
    { name: 'Lazy Mode', href: '/lazy', icon: Tv },
    { name: 'Money', href: '/money', icon: DollarSign },
  ]

  return (
    <nav className="space-y-1.5 mt-6 px-3">
      {navItems.map((item) => {
        const isActive = pathname?.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={cn(
              "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden",
              isActive 
                ? "text-primary font-medium" 
                : "text-zinc-500 hover:text-zinc-200"
            )}
          >
            {/* Active Background Glow */}
            {isActive && (
              <div className="absolute inset-0 bg-primary/10 opacity-100 rounded-xl pointer-events-none" />
            )}
            {/* Hover Background */}
            {!isActive && (
              <div className="absolute inset-0 bg-zinc-800/50 opacity-0 group-hover:opacity-100 rounded-xl pointer-events-none transition-opacity duration-300" />
            )}
            
            <Icon size={18} className={cn("relative z-10 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
            <span className="relative z-10">{item.name}</span>
            
            {/* Active side indicator */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-full" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

export function SidebarBottomLinks() {
  const pathname = usePathname()

  return (
    <div className="space-y-1.5 px-3">
      <Link 
        href="/admin" 
        className={cn(
          "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative",
          pathname === '/admin' ? "text-emerald-400 font-medium bg-emerald-950/50" : "text-emerald-600/70 hover:text-emerald-400 hover:bg-emerald-950/30"
        )}
      >
        <ShieldCheck size={18} className="transition-transform duration-300 group-hover:scale-110" />
        <span>Admin Console</span>
      </Link>
      
      <Link 
        href="/settings" 
        className={cn(
          "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative",
          pathname === '/settings' ? "text-primary font-medium bg-primary/10" : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
        )}
      >
        <Settings size={18} className="transition-transform duration-300 group-hover:scale-110" />
        <span>Settings</span>
      </Link>
    </div>
  )
}
