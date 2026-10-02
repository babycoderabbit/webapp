import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-black">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">Personal OS</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/dashboard" className="p-6 border border-zinc-800 rounded-lg bg-zinc-950 hover:bg-zinc-900 transition-colors">
            <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
            <p className="text-zinc-400">Overview of your day.</p>
          </Link>
          <Link href="/habits" className="p-6 border border-zinc-800 rounded-lg bg-zinc-950 hover:bg-zinc-900 transition-colors">
            <h2 className="text-2xl font-semibold mb-2">Habits</h2>
            <p className="text-zinc-400">Track your daily routines.</p>
          </Link>
          <Link href="/student" className="p-6 border border-zinc-800 rounded-lg bg-zinc-950 hover:bg-zinc-900 transition-colors">
            <h2 className="text-2xl font-semibold mb-2">Student</h2>
            <p className="text-zinc-400">Manage courses and assignments.</p>
          </Link>
          <Link href="/writing" className="p-6 border border-zinc-800 rounded-lg bg-zinc-950 hover:bg-zinc-900 transition-colors">
            <h2 className="text-2xl font-semibold mb-2">Writing</h2>
            <p className="text-zinc-400">Your personal dictionary and docs.</p>
          </Link>
          <Link href="/lazy" className="p-6 border border-zinc-800 rounded-lg bg-zinc-950 hover:bg-zinc-900 transition-colors">
            <h2 className="text-2xl font-semibold mb-2">Lazy Mode</h2>
            <p className="text-zinc-400">Entertainment tracking.</p>
          </Link>
          <Link href="/money" className="p-6 border border-zinc-800 rounded-lg bg-zinc-950 hover:bg-zinc-900 transition-colors">
            <h2 className="text-2xl font-semibold mb-2">Money</h2>
            <p className="text-zinc-400">Financial tracker.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
