import { SidebarLinks, SidebarBottomLinks } from './SidebarLinks'
import { LogOut, Zap } from 'lucide-react'

export function Sidebar() {
  return (
    <aside className="w-72 h-screen bg-background/95 backdrop-blur-xl border-r border-zinc-800/50 flex-col justify-between hidden md:flex transition-colors duration-300 sticky top-0">
      
      {/* Top Section */}
      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 px-6 mb-8 group cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105">
            <Zap size={20} className="text-background" fill="currentColor" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-primary tracking-tight">Antigravity OS</h1>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Workspace</p>
          </div>
        </div>
        
        {/* Primary Navigation */}
        <SidebarLinks />
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-zinc-800/50 bg-background/50">
        <SidebarBottomLinks />
        
        <form action={async () => { 'use server'; const { signOut } = await import('@/auth'); await signOut({ redirectTo: '/login' }) }} className="mt-2 px-3">
          <button type="submit" className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500/70 hover:text-red-400 hover:bg-red-950/30 transition-all duration-300">
            <LogOut size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-medium">Sign Out</span>
          </button>
        </form>
      </div>
      
    </aside>
  )
}
