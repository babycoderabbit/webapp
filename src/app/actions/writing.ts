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

export async function addWord(formData: FormData) {
  const word = formData.get('word') as string
  const meaning = formData.get('meaning') as string
  if (!word || !meaning) return
  await prisma.dictionaryEntry.create({ data: { userId: await getUserId(), word, meaning } })
  revalidatePath('/writing')
}

export async function deleteWord(id: string) {
  await prisma.dictionaryEntry.delete({ where: { id } })
  revalidatePath('/writing')
}

export async function createDocument() {
  const doc = await prisma.writingDocument.create({ 
    data: { userId: await getUserId(), title: 'Untitled Document', content: '' } 
  })
  revalidatePath('/writing')
  return doc
}

export async function deleteDocument(id: string) {
  await prisma.writingDocument.delete({ where: { id } })
  revalidatePath('/writing')
}

export async function updateDocument(id: string, title: string, content: string) {
  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length
  await prisma.writingDocument.update({
    where: { id },
    data: { title, content, wordCount }
  })
  revalidatePath('/writing')
}
export async function updateDictionaryEntry(id: string, word: string, meaning: string) {
  await prisma.dictionaryEntry.update({
    where: { id },
    data: { word, meaning }
  })
  revalidatePath('/writing')
}

export async function updateWritingDocument(id: string, title: string) {
  await prisma.writingDocument.update({
    where: { id },
    data: { title }
  })
  revalidatePath('/writing')
}
