'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Course } from '@prisma/client';

import { useState } from 'react'
import { Trash2, Edit2, Check, X } from 'lucide-react'
import { updateCourse, deleteCourse } from '@/app/actions/student'

export function CourseItem({ course }: { course: Course }) {
  const [isEditing, setIsEditing] = useState(false)
  const [code, setCode] = useState(course.code)
  const [title, setTitle] = useState(course.title)
  const [unit, setUnit] = useState(course.unit)
  const [instructor, setInstructor] = useState(course.instructor || '')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('code', code)
    formData.append('title', title)
    formData.append('unit', unit.toString())
    formData.append('instructor', instructor)
    await updateCourse(course.id, formData)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSave} className="p-5 border-2 border-black bg-white shadow-[4px_4px_0_0_#000000] flex flex-col gap-3">
        <input type="text" value={code} onChange={e => setCode(e.target.value)} required placeholder="Code" className="border-2 border-black p-2 font-bold bg-white text-black outline-none" />
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Title" className="border-2 border-black p-2 font-bold bg-white text-black outline-none" />
        <input type="number" value={unit} onChange={e => setUnit(parseInt(e.target.value))} required min={1} max={6} placeholder="Units" className="border-2 border-black p-2 font-bold bg-white text-black outline-none" />
        <input type="text" value={instructor} onChange={e => setInstructor(e.target.value)} placeholder="Instructor" className="border-2 border-black p-2 font-bold bg-white text-black outline-none" />
        
        <div className="flex gap-2 justify-end mt-2">
          <button type="submit" className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><Check size={18} /></button>
          <button type="button" onClick={() => setIsEditing(false)} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><X size={18} /></button>
        </div>
      </form>
    )
  }

  return (
    <div className="group p-5 border-2 border-black bg-white hover:shadow-[4px_4px_0_0_#000000] transition-all flex justify-between items-start">
      <div>
        <div className="font-extrabold text-xl text-black uppercase tracking-tight">{course.code}</div>
        <div className="text-base font-bold text-black mt-1">{course.title}</div>
        <div className="text-xs font-black uppercase tracking-wider text-black mt-3 border-2 border-black inline-block px-2 py-1">{course.unit} Units • {course.instructor || 'TBA'}</div>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={() => setIsEditing(true)} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer opacity-0 group-hover:opacity-100"><Edit2 size={16}/></button>
        <button type="button" onClick={async () => { await deleteCourse(course.id) }} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
      </div>
    </div>
  )
}
