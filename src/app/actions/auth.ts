'use server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return { error: "Missing fields" }

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return { error: "Email taken" }

  const hashedPassword = await bcrypt.hash(password, 10)
  
  const isAdmin = process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
  
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: isAdmin ? 'ADMIN' : 'USER',
      isVerified: isAdmin ? true : false,
      settings: { create: { theme: 'white' } }
    }
  })

  return { success: true }
}
