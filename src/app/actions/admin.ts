'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function verifyUser(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { isVerified: true }
  })
  revalidatePath('/admin')
}

export async function deleteUser(userId: string) {
  await prisma.user.delete({ where: { id: userId } })
  revalidatePath('/admin')
}

export async function updateUserRole(userId: string, role: 'ADMIN' | 'USER') {
  await prisma.user.update({
    where: { id: userId },
    data: { role }
  })
  revalidatePath('/admin')
}

export async function makeFirstUserAdmin() {
  const user = await prisma.user.findFirst()
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN', isVerified: true }
    })
  }
}
