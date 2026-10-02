'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

async function getUserId() {
  const session = await auth()
  if (session?.user?.id) return session.user.id
  const firstUser = await prisma.user.findFirst()
  if (firstUser) return firstUser.id
  throw new Error("Unauthorized")
}

export async function createCalendarEvent(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const startDateStr = formData.get('startDate') as string
  const endDateStr = formData.get('endDate') as string
  const isHoliday = formData.get('isHoliday') === 'on'
  
  if (!title || !startDateStr || !endDateStr) return

  await prisma.calendarEvent.create({
    data: { 
      userId: await getUserId(), 
      title, 
      description, 
      startDate: new Date(startDateStr),
      endDate: new Date(endDateStr),
      isHoliday
    }
  })
  revalidatePath('/calendar')
  revalidatePath('/dashboard')
}

export async function updateCalendarEvent(id: string, title: string, description: string, startDateStr: string, endDateStr: string, isHoliday: boolean) {
  await prisma.calendarEvent.update({
    where: { id },
    data: { 
      title, 
      description, 
      startDate: new Date(startDateStr),
      endDate: new Date(endDateStr),
      isHoliday
    }
  })
  revalidatePath('/calendar')
  revalidatePath('/dashboard')
}

export async function deleteCalendarEvent(id: string) {
  await prisma.calendarEvent.delete({ where: { id } })
  revalidatePath('/calendar')
  revalidatePath('/dashboard')
}
