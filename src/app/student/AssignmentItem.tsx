// @ts-nocheck
'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Assignment } from '@prisma/client';

import { useState } from 'react'
import { Trash2, Edit2, Check, X } from 'lucide-react'
import { updateAssignment, deleteAssignment, markAssignmentDone } from '@/app/actions/student'

export function AssignmentItem({ assignment, courses }: { assignment: Assignment, courses: Assignment[] }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(assignment.title)
  const [courseId, setCourseId] = useState(assignment.courseId)
  
  const [dueDate, setDueDate] = useState(assignment.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : '')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('courseId', courseId)
    formData.append('dueDate', dueDate)
    await updateAssignment(assignment.id, formData)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSave} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-2 border-black gap-4 bg-white shadow-[4px_4px_0_0_#000000]">
        <div className="flex-1 w-full flex flex-col gap-2">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Title" className="border-2 border-black p-2 font-bold bg-white text-black outline-none" />
          <select value={courseId} onChange={e => setCourseId(e.target.value)} required className="border-2 border-black p-2 font-bold bg-white text-black outline-none">
            {courses.map((c: Assignment) => <option key={c.id} value={c.id}>{c.code}</option>)}
          </select>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="border-2 border-black p-2 font-bold bg-white text-black outline-none" />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><Check size={18} /></button>
          <button type="button" onClick={() => setIsEditing(false)} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><X size={18} /></button>
        </div>
      </form>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-2 border-black bg-white gap-4 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0_0_#000000] transition-all group">
      <div className="flex gap-3 items-center">
        <button type="button" onClick={async () => { await deleteAssignment(assignment.id) }} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><Trash2 size={16}/></button>
        <button type="button" onClick={() => setIsEditing(true)} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><Edit2 size={16}/></button>
        <div>
          <div className="font-bold text-black uppercase tracking-wider">{assignment.title}</div>
          <div className="text-xs font-black tracking-widest mt-1" suppressHydrationWarning>{assignment.course?.code} • Due {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'N/A'}</div>
        </div>
      </div>
      <button 
        type="button"
        onClick={async () => { await markAssignmentDone(assignment.id) }} 
        className="w-full sm:w-auto px-6 py-2 text-xs font-black uppercase tracking-widest border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all cursor-pointer">
        Mark Done
      </button>
    </div>
  )
}
