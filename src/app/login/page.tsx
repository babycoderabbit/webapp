import Link from "next/link"
import { signIn } from "@/auth"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { Zap } from "lucide-react"

export default async function LoginPage() {
  const session = await auth()
  if (session) redirect('/dashboard')

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background fixed inset-0 z-[100] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md p-8 md:p-10 bg-card/40 backdrop-blur-2xl border border-border rounded-[2rem] shadow-2xl relative z-10">
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap size={28} className="text-background" fill="currentColor" />
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Welcome Back</h2>
          <p className="text-muted font-medium mt-2">Sign in to your Personal OS.</p>
        </div>
        
        <form className="space-y-6" action={async (formData) => {
          'use server'
          await signIn('credentials', formData)
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2 ml-1">Email</label>
              <input type="email" name="email" required className="block w-full rounded-xl bg-background/50 border border-border p-4 text-sm text-foreground focus:border-primary focus:outline-none transition-colors" placeholder="hello@example.com" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2 ml-1">Password</label>
              <input type="password" name="password" required className="block w-full rounded-xl bg-background/50 border border-border p-4 text-sm text-foreground focus:border-primary focus:outline-none transition-colors" placeholder="••••••••" />
            </div>
          </div>
          
          <button type="submit" className="w-full flex justify-center py-4 px-4 rounded-xl shadow-lg shadow-primary/20 text-sm font-bold uppercase tracking-widest text-background bg-primary hover:opacity-90 transition-all hover:-translate-y-1 mt-8">
            Access Terminal
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm font-medium text-muted">
          New to the system? <Link href="/register" className="text-primary hover:underline underline-offset-4">Initialize Account</Link>
        </p>
      </div>
    </div>
  )
}
