import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import EditorClient from './EditorClient'

export default async function DocumentServerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = await prisma.writingDocument.findUnique({ where: { id } })
  if (!doc) redirect('/writing')
  
  return <EditorClient doc={doc} />
}
