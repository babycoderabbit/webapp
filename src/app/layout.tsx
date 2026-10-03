import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'
import { GlobalAntiDoubleTap } from '@/components/GlobalAntiDoubleTap'
import { MobileNav } from '@/components/MobileNav'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Personal OS | Your Command Center',
    template: '%s | Personal OS',
  },
  description: 'A self-contained personal operating system to manage habits, tasks, studies, and finances seamlessly.',
  keywords: ['productivity', 'dashboard', 'habits', 'planner', 'personal OS', 'student'],
  authors: [{ name: 'Admin' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Personal OS | Your Command Center',
    description: 'A self-contained personal operating system to manage habits, tasks, studies, and finances seamlessly.',
    url: 'https://webapp.vercel.app',
    siteName: 'Personal OS',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal OS',
    description: 'A self-contained personal operating system to manage habits, tasks, studies, and finances seamlessly.',
  },
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
        <GlobalAntiDoubleTap />
        <Sidebar />
        <main className="flex-1 pb-24 md:pb-0 h-screen overflow-y-auto overflow-x-hidden">
          {children}
        </main>
        <MobileNav />
      </body>
    </html>
  )
}
