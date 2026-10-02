// @ts-nocheck
'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { LectureNote } from '@prisma/client';
import { useState } from 'react'
import { Trash2, Edit2, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { updateLectureNote, deleteLectureNote } from '@/app/actions/student'

export function LectureNoteItem({ note, courses }: { note: LectureNote, courses: LectureNote[] }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (isEditing) {
    return (
      <form action={async (formData) => {
        const title = formData.get('title') as string
        const content = formData.get('content') as string
        const courseId = formData.get('courseId') as string
        await updateLectureNote(note.id, title, content, courseId)
        setIsEditing(false)
      }} className="flex flex-col gap-3 p-4 bg-white border border-black shadow-lg">
        <input type="text" name="title" defaultValue={note.title} required className="border border-black p-2 font-bold focus:outline-none" />
        <select name="courseId" defaultValue={note.courseId} required className="border border-black p-2 font-bold focus:outline-none cursor-pointer">
          {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
        </select>
        <textarea name="content" defaultValue={note.content} rows={5} className="border border-black p-2 font-bold focus:outline-none" />
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-black text-white px-4 py-2 font-black uppercase border border-black hover:bg-white hover:text-black transition-colors cursor-pointer">Save</button>
          <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white text-black font-black uppercase border border-black hover:bg-black hover:text-white transition-colors cursor-pointer">Cancel</button>
        </div>
      </form>
    )
  }

  return (
    <div className="p-4 bg-white border border-black flex flex-col gap-3 hover:translate-x-1 hover:-translate-y-1 hover:shadow-lg transition-all group">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col cursor-pointer flex-1" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2">
            <FileText size={18} />
            <span className="font-black text-lg uppercase">{note.title}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          <span className="text-xs font-bold tracking-widest uppercase mt-1 inline-block w-fit border border-black px-2 py-1">{note.course?.code}</span>
        </div>
        <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity self-end sm:self-auto flex-shrink-0">
          <button onClick={() => setIsEditing(true)} className="p-2 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"><Edit2 size={16}/></button>
          <form action={async () => { await deleteLectureNote(note.id) }}>
            <button type="submit" className="p-2 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"><Trash2 size={16}/></button>
          </form>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 pt-4 border-t-4 border-black whitespace-pre-wrap font-medium text-sm">
          {note.content}
        </div>
      )}
    </div>
  )
}
