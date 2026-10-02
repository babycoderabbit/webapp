'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

async function getUserId() {
  const session = await auth()
  if (session?.user?.id) return session.user.id
  
  // Dev fallback
  const firstUser = await prisma.user.findFirst()
  if (firstUser) return firstUser.id
  throw new Error("Unauthorized")
}

export async function createTask(formData: FormData) {
  const userId = await getUserId()
  const title = formData.get('title') as string
  
  if (!title) return { error: "Title is required" }

  await prisma.task.create({
    data: {
      userId,
      title,
      priority: 'MEDIUM',
      status: 'TODO'
    }
  })

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteTask(taskId: string) {
  await prisma.task.delete({ where: { id: taskId } })
  revalidatePath('/dashboard')
}
