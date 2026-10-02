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

export async function markAssignmentDone(assignmentId: string) {
  await prisma.assignment.update({ where: { id: assignmentId }, data: { status: 'DONE' } })
  revalidatePath('/student')
}

export async function deleteAssignment(id: string) {
  await prisma.assignment.delete({ where: { id } })
  revalidatePath('/student')
}

export async function createAssignment(formData: FormData) {
  const title = formData.get('title') as string
  const courseId = formData.get('courseId') as string
  const dueDate = formData.get('dueDate') as string
  if (!title || !courseId) return
  await prisma.assignment.create({
    data: { userId: await getUserId(), title, courseId, dueDate: new Date(dueDate), status: 'NOT_DONE' }
  })
  revalidatePath('/student')
}

export async function createTimetableSlot(formData: FormData) {
  const courseId = formData.get('courseId') as string
  const dayOfWeek = parseInt(formData.get('dayOfWeek') as string)
  const startTime = formData.get('startTime') as string
  const endTime = formData.get('endTime') as string
  const roomOrLink = formData.get('roomOrLink') as string
  if (!courseId) return
  await prisma.timetableSlot.create({
    data: { userId: await getUserId(), courseId, dayOfWeek, startTime, endTime, roomOrLink }
  })
  revalidatePath('/student')
}

export async function deleteTimetableSlot(id: string) {
  await prisma.timetableSlot.delete({ where: { id } })
  revalidatePath('/student')
}

export async function createCourse(formData: FormData) {
  const code = formData.get('code') as string
  const title = formData.get('title') as string
  const rawUnit = formData.get('unit') as string
  let unit = rawUnit ? parseInt(rawUnit) : 3
  if (isNaN(unit)) unit = 3
  if (unit < 1) unit = 1
  if (unit > 6) unit = 6
  const instructor = formData.get('instructor') as string
  if (!code || !title) return
  await prisma.course.create({
    data: { userId: await getUserId(), code, title, unit, instructor }
  })
  revalidatePath('/student')
}

export async function deleteCourse(id: string) {
  await prisma.course.delete({ where: { id } })
  revalidatePath('/student')
}

export async function updateCourse(id: string, formData: FormData) {
  const code = formData.get('code') as string
  const title = formData.get('title') as string
  const rawUnit = formData.get('unit') as string
  let unit = rawUnit ? parseInt(rawUnit) : 3
  if (isNaN(unit)) unit = 3
  if (unit < 1) unit = 1
  if (unit > 6) unit = 6
  const instructor = formData.get('instructor') as string

  await prisma.course.update({
    where: { id },
    data: { code, title, unit, instructor }
  })
  revalidatePath('/student')
}

export async function updateTimetableSlot(id: string, formData: FormData) {
  const courseId = formData.get('courseId') as string
  const dayOfWeek = parseInt(formData.get('dayOfWeek') as string)
  const startTime = formData.get('startTime') as string
  const endTime = formData.get('endTime') as string
  const roomOrLink = formData.get('roomOrLink') as string

  await prisma.timetableSlot.update({
    where: { id },
    data: { courseId, dayOfWeek, startTime, endTime, roomOrLink }
  })
  revalidatePath('/student')
}

export async function updateAssignment(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const courseId = formData.get('courseId') as string
  const dueDate = formData.get('dueDate') as string

  await prisma.assignment.update({
    where: { id },
    data: { title, courseId, dueDate: dueDate ? new Date(dueDate) : null }
  })
  revalidatePath('/student')
}
export async function createLectureNote(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const courseId = formData.get('courseId') as string
  if (!title || !courseId) return
  await prisma.lectureNote.create({
    data: { userId: await getUserId(), title, content, courseId }
  })
  revalidatePath('/student')
}

export async function updateLectureNote(id: string, title: string, content: string, courseId: string) {
  await prisma.lectureNote.update({
    where: { id },
    data: { title, content, courseId }
  })
  revalidatePath('/student')
}

export async function deleteLectureNote(id: string) {
  await prisma.lectureNote.delete({ where: { id } })
  revalidatePath('/student')
}
