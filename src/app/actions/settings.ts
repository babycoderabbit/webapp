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

export async function updateSettings(formData: FormData) {
  const theme = formData.get('theme') as string
  const timezone = formData.get('timezone') as string
  const email = formData.get('email') as string | null
  const password = formData.get('password') as string | null
  
  const userId = await getUserId()

  await prisma.userSettings.upsert({
    where: { userId },
    update: { theme, timezone },
    create: { userId, theme, timezone }
  })
  
  const userUpdateData: any = {}
  if (email) userUpdateData.email = email
  if (password) {
    const bcrypt = await import('bcryptjs')
    userUpdateData.password = await bcrypt.hash(password, 10)
  }
  
  if (Object.keys(userUpdateData).length > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: userUpdateData
    })
  }
  
  revalidatePath('/settings')
}
