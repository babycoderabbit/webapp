import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'
import { MobileNav } from '@/components/MobileNav'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Personal OS',
  description: 'Self-contained personal operating system',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (session?.user?.id) {
    await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { settings: true }
    })

  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-black antialiased flex min-h-screen`} suppressHydrationWarning>
        <Sidebar />
        <main className="flex-1 pb-24 md:pb-0 h-screen overflow-y-auto overflow-x-hidden">
          {children}
        </main>
        <MobileNav />
      </body>
    </html>
  )
}
