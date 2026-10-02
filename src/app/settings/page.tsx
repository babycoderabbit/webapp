import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { updateSettings } from '@/app/actions/settings'
import { Save, Settings2, User, Palette, Globe, LogOut } from 'lucide-react'

export default async function SettingsPage() {
  const session = await auth()
  let userId = session?.user?.id
  if (!userId) {
    const firstUser = await prisma.user.findFirst()
    if (firstUser) userId = firstUser.id
    else redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { settings: true }
  })
  
  if (!user) redirect('/login')
  
  const settings = user.settings || { theme: 'pure-black', accentColor: 'blue', timezone: 'Africa/Lagos', firstDayOfWeek: 'Sunday' }

  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-8 max-w-4xl mx-auto">
      <header className="bg-card/30 p-6 md:p-8 rounded-[2rem] border border-border backdrop-blur-xl">
        <div className="flex items-center gap-3 text-primary font-semibold tracking-widest uppercase text-xs mb-3">
          <Settings2 size={18} /> Configuration
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted font-medium mt-2">Tune your Personal OS environment.</p>
      </header>

      <div className="bg-card/40 backdrop-blur-xl border border-border rounded-3xl p-6 md:p-10 shadow-xl">
        <form action={async (formData) => { 'use server'; await updateSettings(formData) }} className="space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2 border-b border-border/50 pb-2">
              <User size={18} className="text-primary"/> Profile
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted ml-1">Account Email</label>
                <input type="email" name="email" defaultValue={user.email} required className="w-full bg-background border border-border rounded-xl p-3 text-foreground font-medium focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted ml-1">New Password (Optional)</label>
                <input type="password" name="password" placeholder="Leave blank to keep current password" minLength={6} className="w-full bg-background border border-border rounded-xl p-3 text-foreground font-medium focus:outline-none focus:border-primary transition-colors" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2 border-b border-border/50 pb-2">
              <Palette size={18} className="text-primary"/> Appearance
            </h2>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted ml-1">Theme Interface</label>
              <select name="theme" defaultValue="white" className="w-full bg-background border border-border rounded-xl p-3 text-foreground font-medium focus:outline-none focus:border-primary transition-colors appearance-none">
                <option value="white">White (Default)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2 border-b border-border/50 pb-2">
              <Globe size={18} className="text-primary"/> Localization
            </h2>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted ml-1">Timezone</label>
              <select name="timezone" defaultValue={settings.timezone} className="w-full bg-background border border-border rounded-xl p-3 text-foreground font-medium focus:outline-none focus:border-primary transition-colors appearance-none">
                <option value="Europe/Berlin">Germany (Europe/Berlin)</option>
                <option value="Europe/London">UK (Europe/London)</option>
                <option value="Asia/Shanghai">China (Asia/Shanghai)</option>
                <option value="Asia/Tokyo">Japan (Asia/Tokyo)</option>
                <option value="America/New_York">USA (America/New_York)</option>
                <option value="Africa/Lagos">Nigeria (Africa/Lagos)</option>
                <option value="Australia/Sydney">Australia (Australia/Sydney)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full sm:w-auto flex justify-center items-center gap-2 bg-primary text-background px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm hover:shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-1">
            <Save size={18} /> Apply Changes
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-border/50">
          <form action={async () => { 'use server'; const { signOut } = await import('@/auth'); await signOut({ redirectTo: '/login' }) }}>
            <button type="submit" className="group flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-all">
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Sign Out of OS
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
