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

export async function addTransaction(formData: FormData) {
  const type = formData.get('type') as string
  const amount = parseFloat(formData.get('amount') as string)
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  
  if (!amount || !category) return

  await prisma.transaction.create({
    data: { userId: await getUserId(), type, amount, category, description }
  })
  revalidatePath('/money')
}

export async function deleteTransaction(id: string) {
  await prisma.transaction.delete({ where: { id } })
  revalidatePath('/money')
}

export async function addBudget(formData: FormData) {
  const category = formData.get('category') as string
  const monthlyLimit = parseFloat(formData.get('monthlyLimit') as string)
  const month = formData.get('month') as string

  if (!category || !monthlyLimit || !month) return

  await prisma.budget.create({
    data: { userId: await getUserId(), category, monthlyLimit, month }
  })
  revalidatePath('/money')
}

export async function deleteBudget(id: string) {
  await prisma.budget.delete({ where: { id } })
  revalidatePath('/money')
}

export async function addSavingsGoal(formData: FormData) {
  const title = formData.get('title') as string
  const targetAmount = parseFloat(formData.get('targetAmount') as string)
  const targetDateStr = formData.get('targetDate') as string
  let targetDate = null
  if (targetDateStr) {
    targetDate = new Date(targetDateStr)
  }

  if (!title || !targetAmount) return

  await prisma.savingsGoal.create({
    data: { userId: await getUserId(), title, targetAmount, targetDate }
  })
  revalidatePath('/money')
}

export async function updateSavingsGoalProgress(id: string, currentAmount: number) {
  await prisma.savingsGoal.update({
    where: { id },
    data: { currentAmount }
  })
  revalidatePath('/money')
}

export async function deleteSavingsGoal(id: string) {
  await prisma.savingsGoal.delete({ where: { id } })
  revalidatePath('/money')
}

export async function updateTransaction(id: string, type: string, amount: number, category: string, description: string) {
  await prisma.transaction.update({
    where: { id },
    data: { type, amount, category, description }
  })
  revalidatePath('/money')
}

export async function updateBudget(id: string, category: string, monthlyLimit: number, month: string) {
  await prisma.budget.update({
    where: { id },
    data: { category, monthlyLimit, month }
  })
  revalidatePath('/money')
}

export async function updateSavingsGoal(id: string, title: string, targetAmount: number, targetDate: Date | null) {
  await prisma.savingsGoal.update({
    where: { id },
    data: { title, targetAmount, targetDate }
  })
  revalidatePath('/money')
}
