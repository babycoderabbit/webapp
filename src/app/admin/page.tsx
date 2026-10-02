import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { updateUserRole, deleteUser } from '@/app/actions/admin'
import { ShieldCheck, ShieldAlert, Trash2, Users } from 'lucide-react'

export default async function AdminPage() {
  const session = await auth()
  
  if (!session?.user?.email) redirect('/login')
  
  const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <ShieldAlert size={64} className="text-red-500/50" />
        <h1 className="text-4xl font-black text-red-500 tracking-tight">Access Restricted</h1>
        <p className="text-muted font-medium">You must be an Administrator to view this secure terminal.</p>
      </div>
    )
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <header className="bg-card/30 p-6 md:p-8 rounded-[2rem] border border-border backdrop-blur-xl">
        <div className="flex items-center gap-3 text-emerald-500 font-semibold tracking-widest uppercase text-xs mb-3">
          <ShieldCheck size={18} /> Superuser Terminal
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">Admin Console</h1>
        <p className="text-muted font-medium mt-2">Manage registrations, roles, and verification status.</p>
      </header>

      <div className="bg-card/40 backdrop-blur-xl border border-border rounded-3xl p-6 md:p-8 shadow-xl overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Users size={20} />
          </div>
          <h2 className="text-xl font-bold tracking-tight">System Users</h2>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-border/50 text-xs font-bold uppercase tracking-widest text-muted">
                <th className="py-3 px-2">Identity</th>
                <th className="py-3 px-2">Contact</th>
                <th className="py-3 px-2">Clearance</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-border/20 text-sm hover:bg-background/50 transition-colors group">
                  <td className="py-4 px-2 font-bold text-foreground">{u.name}</td>
                  <td className="py-4 px-2 font-medium text-muted">{u.email}</td>
                  <td className="py-4 px-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${u.role === 'ADMIN' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-card text-muted border border-border'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-2 flex justify-end gap-2">
                    {u.id !== currentUser.id && (
                      <form action={async () => { 'use server'; await updateUserRole(u.id, u.role === 'ADMIN' ? 'USER' : 'ADMIN') }}>
                        <button className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary hover:text-background transition-colors">
                          {u.role === 'ADMIN' ? 'Demote' : 'Make Admin'}
                        </button>
                      </form>
                    )}
                    {u.id !== currentUser.id && (
                      <form action={async () => { 'use server'; await deleteUser(u.id) }}>
                        <button className="text-muted hover:text-red-500 px-2 py-1.5 bg-card rounded-lg border border-border opacity-50 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
