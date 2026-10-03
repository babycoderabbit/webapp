import os

base = r"C:\Users\Bursar's Office\Music\Web app 1\webapp"

def replace_in_file(rel_path, old, new):
    p = os.path.join(base, rel_path)
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace(old, new)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)

# 1. auth.ts
replace_in_file('src/auth.ts', 
'import NextAuth from "next-auth"\nimport Credentials from "next-auth/providers/credentials"\nimport prisma from "@/lib/prisma"\nimport bcrypt from "bcryptjs"\n\nexport const { handlers, signIn, signOut, auth } = NextAuth({\n  providers: [', 
'import NextAuth from "next-auth"\nimport Credentials from "next-auth/providers/credentials"\nimport prisma from "@/lib/prisma"\nimport bcrypt from "bcryptjs"\nimport authConfig from "./auth.config"\n\nexport const { handlers, signIn, signOut, auth } = NextAuth({\n  ...authConfig,\n  providers: [')
replace_in_file('src/auth.ts', '  pages: {\n    signIn: \'/login\',\n  },\n  callbacks: {\n    async session({ session, token }) {\n      if (token?.sub) {\n        session.user.id = token.sub\n      }\n      return session\n    },\n    async jwt({ token, user }) {\n      if (user) {\n        token.sub = user.id\n      }\n      return token\n    }\n  }', '')

# 2. lazy/page.tsx
replace_in_file('src/app/lazy/page.tsx', 
'import { MediaItem } from \'@prisma/client\'',
'import { MediaItem } from \'@prisma/client\'\nimport { SubmitButton } from \'@/components/SubmitButton\'')
replace_in_file('src/app/lazy/page.tsx', 'grid-cols-2 md:grid-cols-3', 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3')
replace_in_file('src/app/lazy/page.tsx', '<button type="submit" className="bg-primary text-background px-3 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all">Save</button>', '<SubmitButton className="bg-primary text-background px-3 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all">Save</SubmitButton>')

# 3. habits/page.tsx
replace_in_file('src/app/habits/page.tsx', 
'import { Sun, Sunset, Moon, Activity } from \'lucide-react\'',
'import { Sun, Sunset, Moon, Activity, Target } from \'lucide-react\'\nimport { ReminderToggle } from \'@/components/ReminderToggle\'')
replace_in_file('src/app/habits/page.tsx', 
'const habits = await prisma.habit.findMany({ where: { userId } })',
'const habits = await prisma.habit.findMany({ where: { userId } })\n  const tasks = await prisma.task.findMany({ where: { userId, status: { not: \'COMPLETED\' } } })')
replace_in_file('src/app/habits/page.tsx',
'<form action={async (formData) => { \'use server\'; await createHabit(formData) }} className="w-full md:w-auto flex flex-col sm:flex-row gap-2">',
'<div className="w-full md:w-auto flex flex-col gap-4">\n          <div className="flex flex-col sm:flex-row justify-start md:justify-end gap-2">\n            <a href="/dashboard#tasks" className="p-2 border border-black bg-black text-white hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs"><Target size={16}/> Go To Tasks</a>\n            <ReminderToggle tasks={tasks} habits={habits} />\n          </div>\n          <form action={async (formData) => { \'use server\'; await createHabit(formData) }} className="w-full flex flex-col sm:flex-row gap-2">')
replace_in_file('src/app/habits/page.tsx',
'</button>\n        </form>\n      </header>',
'</button>\n          </form>\n        </div>\n      </header>')

# 4. dashboard/page.tsx
replace_in_file('src/app/dashboard/page.tsx',
'<div className="border border-black p-6 shadow-lg bg-white">\n              <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">\n                <Target size={28} />\n                <h3 className="text-2xl font-black tracking-tighter uppercase">Active Tasks</h3>',
'<div id="tasks" className="border border-black p-6 shadow-lg bg-white">\n              <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">\n                <Target size={28} />\n                <h3 className="text-2xl font-black tracking-tighter uppercase">Active Tasks</h3>')

# 5. money/SavingsGoalItem.tsx
replace_in_file('src/app/money/SavingsGoalItem.tsx',
'<div className="flex justify-between items-center font-bold text-sm uppercase tracking-widest mt-2">\n        <span>{formatNaira(goal.currentAmount)} saved</span>\n        <span>{formatNaira(goal.targetAmount)} goal</span>\n      </div>',
'<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center font-bold text-sm uppercase tracking-widest mt-2 gap-1 sm:gap-4">\n        <span>{formatNaira(goal.currentAmount)} saved</span>\n        <span className="text-blue-600 dark:text-blue-400">{formatNaira(Math.max(0, goal.targetAmount - goal.currentAmount))} remaining</span>\n        <span>{formatNaira(goal.targetAmount)} goal</span>\n      </div>')

# 6. layout.tsx
replace_in_file('src/app/layout.tsx',
'import { Sidebar } from \'@/components/Sidebar\'',
'import { Sidebar } from \'@/components/Sidebar\'\nimport { GlobalAntiDoubleTap } from \'@/components/GlobalAntiDoubleTap\'')
replace_in_file('src/app/layout.tsx',
'<Sidebar />',
'<GlobalAntiDoubleTap />\n        <Sidebar />')

print("Reapplied")
