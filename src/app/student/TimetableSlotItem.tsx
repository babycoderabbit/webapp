// @ts-nocheck
'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { TimetableSlot } from '@prisma/client';

import { useState } from 'react'
import { Trash2, Edit2, Check, X } from 'lucide-react'
import { updateTimetableSlot, deleteTimetableSlot } from '@/app/actions/student'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function TimetableSlotItem({ slot, courses }: { slot: TimetableSlot, courses: TimetableSlot[] }) {
  const [isEditing, setIsEditing] = useState(false)
  const [courseId, setCourseId] = useState(slot.courseId)
  const [dayOfWeek, setDayOfWeek] = useState(slot.dayOfWeek)
  const [startTime, setStartTime] = useState(slot.startTime)
  const [endTime, setEndTime] = useState(slot.endTime)
  const [roomOrLink, setRoomOrLink] = useState(slot.roomOrLink || '')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('courseId', courseId)
    formData.append('dayOfWeek', dayOfWeek.toString())
    formData.append('startTime', startTime)
    formData.append('endTime', endTime)
    formData.append('roomOrLink', roomOrLink)
    await updateTimetableSlot(slot.id, formData)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSave} className="flex flex-col gap-3 p-4 border border-black bg-white shadow-lg">
        <div className="flex gap-2">
          <select value={courseId} onChange={e => setCourseId(e.target.value)} required className="flex-1 border border-black p-2 font-bold bg-white text-black outline-none">
            {courses.map((c: TimetableSlot) => <option key={c.id} value={c.id}>{c.code}</option>)}
          </select>
          <select value={dayOfWeek} onChange={e => setDayOfWeek(parseInt(e.target.value))} required className="flex-1 border border-black p-2 font-bold bg-white text-black outline-none">
            {days.map((d, i) => <option key={i} value={i}>{d}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required className="flex-1 border border-black p-2 font-bold bg-white text-black outline-none" />
          <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required className="flex-1 border border-black p-2 font-bold bg-white text-black outline-none" />
        </div>
        <input type="text" value={roomOrLink} onChange={e => setRoomOrLink(e.target.value)} placeholder="Room/Link" className="border border-black p-2 font-bold bg-white text-black outline-none" />
        
        <div className="flex gap-2 justify-end mt-2">
          <button type="submit" className="p-2 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><Check size={18} /></button>
          <button type="button" onClick={() => setIsEditing(false)} className="p-2 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><X size={18} /></button>
        </div>
      </form>
    )
  }

  return (
    <div className="group flex justify-between items-center bg-white p-4 border border-black hover:-translate-y-1 hover:translate-x-1 hover:shadow-lg transition-all">
      <div>
        <div className="font-extrabold text-black uppercase tracking-tight">{slot.course?.code}</div>
        <div className="text-sm font-bold text-black mt-1 uppercase tracking-widest">{slot.startTime} - {slot.endTime} • {slot.roomOrLink || 'TBA'}</div>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={() => setIsEditing(true)} className="p-2 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer opacity-0 group-hover:opacity-100"><Edit2 size={16}/></button>
        <button type="button" onClick={async () => { await deleteTimetableSlot(slot.id) }} className="p-2 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
      </div>
    </div>
  )
}
