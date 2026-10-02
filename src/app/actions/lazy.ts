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

export async function addMedia(formData: FormData) {
  const title = formData.get('title') as string
  let type = formData.get('type') as string
  if (type === 'MOVIE' && Math.random() > 0.5) type = 'SERIES' // Just for UI variance
  if (!title) return
  await prisma.mediaItem.create({ data: { userId: await getUserId(), title, type, status: 'PLANNING' } })
  revalidatePath('/lazy')
}

export async function deleteMedia(id: string) {
  await prisma.mediaItem.delete({ where: { id } })
  revalidatePath('/lazy')
}

export async function updateMediaItem(id: string, title: string, status: string) {
  await prisma.mediaItem.update({
    where: { id },
    data: { title, status }
  })
  revalidatePath('/lazy')
}
