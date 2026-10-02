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

export async function logHabit(habitId: string, status: string) {
  const userId = await getUserId()
  const today = new Date().toISOString().split('T')[0]

  await prisma.habitLog.upsert({
    where: {
      habitId_date: {
        habitId,
        date: today
      }
    },
    update: { status },
    create: {
      habitId,
      userId,
      date: today,
      status
    }
  })

  revalidatePath('/habits')
}

export async function createHabit(formData: FormData) {
  const title = formData.get('title') as string
  const timeOfDay = formData.get('timeOfDay') as string
  if (!title) return
  await prisma.habit.create({
    data: { userId: await getUserId(), title, timeOfDay }
  })
  revalidatePath('/habits')
  revalidatePath('/dashboard')
}

export async function deleteHabit(habitId: string) {
  await prisma.habit.delete({ where: { id: habitId } })
  revalidatePath('/habits')
  revalidatePath('/dashboard')
}

export async function updateHabit(habitId: string, title: string, timeOfDay: string) {
  await prisma.habit.update({
    where: { id: habitId },
    data: { title, timeOfDay }
  })
  revalidatePath('/habits')
  revalidatePath('/dashboard')
}
