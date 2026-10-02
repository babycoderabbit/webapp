// @ts-nocheck
import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { createAssignment, createTimetableSlot, createCourse, createLectureNote } from '@/app/actions/student'
import { BookOpen, Clock, CheckCircle2, GraduationCap, FileText } from 'lucide-react'
import { CourseItem } from './CourseItem'
import { AssignmentItem } from './AssignmentItem'
import { TimetableSlotItem } from './TimetableSlotItem'
import { LectureNoteItem } from './LectureNoteItem'

export default async function StudentPage() {
  const session = await auth()
  let userId = session?.user?.id
  if (!userId) {
    const firstUser = await prisma.user.findFirst()
    if (firstUser) userId = firstUser.id
    else redirect('/login')
  }

  const assignments = await prisma.assignment.findMany({ where: { userId }, include: { course: true }, orderBy: { dueDate: 'asc' } })
  const courses = await prisma.course.findMany({ where: { userId } })
  const timetableSlots = await prisma.timetableSlot.findMany({ where: { userId }, include: { course: true }, orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }] })
  const lectureNotes = await prisma.lectureNote.findMany({ where: { userId }, include: { course: true }, orderBy: { createdAt: 'desc' } })

  const pendingAssignments = assignments.filter(a => a.status !== 'DONE')
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto bg-white text-black min-h-screen">
      <header className="border border-black p-6 md:p-8 bg-white shadow-lg">
        <div className="flex items-center gap-3 font-black tracking-widest uppercase text-xs mb-3">
          <GraduationCap size={24} /> Academia
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Student Mode</h1>
        <p className="font-bold mt-2 uppercase tracking-widest text-sm text-black">Manage your academic life seamlessly.</p>
      </header>
      
      <div className="border border-black bg-white p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
          <BookOpen size={28} />
          <h2 className="text-2xl font-black tracking-tighter uppercase">Courses Overview</h2>
        </div>
        
        <form action={async (formData) => { 'use server'; await createCourse(formData) }} className="mb-6 flex flex-col md:flex-row flex-wrap gap-3 items-stretch md:items-center">
          <input type="text" name="code" required placeholder="Code (CS101)" className="border border-black p-3 text-sm font-bold flex-1 min-w-[100px] focus:outline-none" />
          <input type="text" name="title" required placeholder="Course Title" className="border border-black p-3 text-sm font-bold flex-[2] min-w-[140px] focus:outline-none" />
          <input type="number" name="unit" required placeholder="Units" defaultValue={3} min={1} max={6} className="border border-black p-3 text-sm font-bold w-24 focus:outline-none" />
          <input type="text" name="instructor" placeholder="Lecturer" className="border border-black p-3 text-sm font-bold flex-1 min-w-[100px] focus:outline-none" />
          <button type="submit" className="bg-black text-white border border-black px-6 py-3 font-black uppercase text-sm hover:bg-white hover:text-black transition-all shrink-0 w-full md:w-auto cursor-pointer">Add</button>
        </form>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseItem key={course.id} course={course} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-black bg-white p-6 md:p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
            <CheckCircle2 size={28} />
            <h2 className="text-2xl font-black tracking-tighter uppercase">Assignments</h2>
          </div>
          
          <form action={async (formData) => { 'use server'; await createAssignment(formData) }} className="mb-6 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" name="title" required placeholder="Assignment title..." className="border border-black p-3 text-sm font-bold flex-1 focus:outline-none min-w-0" />
              <select name="courseId" required defaultValue="" className="border border-black p-3 text-sm font-bold focus:outline-none w-full sm:w-auto min-w-0 cursor-pointer">
                <option value="" disabled>Course</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="date" name="dueDate" required className="border border-black p-3 text-sm font-bold flex-1 focus:outline-none min-w-0" />
              <button type="submit" className="bg-black text-white px-6 py-3 font-black uppercase border border-black hover:bg-white hover:text-black transition-all w-full sm:w-auto cursor-pointer">Add</button>
            </div>
          </form>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-3 border-b-2 border-black pb-1 inline-block">Pending Work</h3>
              {pendingAssignments.length === 0 ? <div className="text-sm font-bold text-center py-4 border border-black uppercase tracking-widest">Clear skies ahead!</div> :
                <div className="space-y-4">
                  {pendingAssignments.map(a => (
                    <AssignmentItem key={a.id} assignment={a} courses={courses} />
                  ))}
                </div>
              }
            </div>
          </div>
        </div>

        <div className="border border-black bg-white p-6 md:p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
            <Clock size={28} />
            <h2 className="text-2xl font-black tracking-tighter uppercase">Timetable</h2>
          </div>
          
          <form action={async (formData) => { 'use server'; await createTimetableSlot(formData) }} className="mb-6 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <select name="courseId" required defaultValue="" className="border border-black p-3 text-sm font-bold focus:outline-none flex-1 min-w-0 cursor-pointer">
                <option value="" disabled>Course</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
              </select>
              <select name="dayOfWeek" required className="border border-black p-3 text-sm font-bold focus:outline-none flex-1 min-w-0 cursor-pointer">
                {days.map((d, i) => <option key={i} value={i}>{d}</option>)}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="time" name="startTime" required className="border border-black p-3 text-sm font-bold flex-1 focus:outline-none min-w-0" />
              <input type="time" name="endTime" required className="border border-black p-3 text-sm font-bold flex-1 focus:outline-none min-w-0" />
              <input type="text" name="roomOrLink" placeholder="Room/Link" className="border border-black p-3 text-sm font-bold flex-1 focus:outline-none min-w-0" />
            </div>
            <button type="submit" className="w-full bg-black text-white px-4 py-3 font-black uppercase border border-black hover:bg-white hover:text-black transition-all cursor-pointer">Add Slot</button>
          </form>

          <div className="space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            {days.map((day, i) => {
              const daySlots = timetableSlots.filter(s => s.dayOfWeek === i)
              if (daySlots.length === 0) return null
              return (
                <div key={day} className="relative">
                  <h3 className="sticky top-0 bg-white text-xs font-black uppercase tracking-widest mb-3 py-2 z-10 border-b-4 border-black">{day}</h3>
                  <div className="space-y-4">
                    {daySlots.map(slot => (
                      <TimetableSlotItem key={slot.id} slot={slot} courses={courses} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Lecture Notes Section */}
      <div className="border border-black bg-white p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
          <FileText size={28} />
          <h2 className="text-2xl font-black tracking-tighter uppercase">Lecture Notes</h2>
        </div>
        
        <form action={async (formData) => { 'use server'; await createLectureNote(formData) }} className="mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="text" name="title" required placeholder="Note Title" className="border border-black p-3 text-sm font-bold flex-1 min-w-0 focus:outline-none" />
            <select name="courseId" required defaultValue="" className="border border-black p-3 text-sm font-bold focus:outline-none w-full sm:w-auto min-w-0 cursor-pointer">
              <option value="" disabled>Course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
            </select>
          </div>
          <textarea name="content" required placeholder="Write your notes here in Markdown..." rows={6} className="border border-black p-3 text-sm font-bold w-full focus:outline-none" />
          <button type="submit" className="w-full bg-black text-white px-6 py-4 font-black uppercase border border-black hover:bg-white hover:text-black transition-all cursor-pointer">Save Note</button>
        </form>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lectureNotes.length === 0 ? (
             <div className="md:col-span-2 text-sm font-bold text-center py-6 border border-black uppercase tracking-widest">No lecture notes yet.</div>
          ) : (
            lectureNotes.map(note => (
              <LectureNoteItem key={note.id} note={note} courses={courses} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
