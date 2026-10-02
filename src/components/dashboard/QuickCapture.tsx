'use client'
import { useState } from 'react'
import { Plus, Zap, ArrowRight } from 'lucide-react'
import { createTask } from '@/app/actions'

export function QuickCapture() {
  const [addingTask, setAddingTask] = useState(false)

  return (
    <div className="bg-white border border-black p-6 shadow-lg relative">
      <div className="flex items-center gap-2 mb-6 relative z-10 border-b-4 border-black pb-4">
        <Zap size={28} className="text-black" fill="currentColor" />
        <h3 className="text-2xl font-black uppercase tracking-tighter text-black">Quick Capture</h3>
      </div>
      
      {addingTask ? (
        <form action={async (formData) => {
          await createTask(formData)
          setAddingTask(false)
        }} className="mb-2 relative z-10">
          <input 
            type="text" 
            name="title" 
            autoFocus
            placeholder="Type task..." 
            className="w-full bg-white border border-black p-4 text-lg text-black font-bold mb-3 focus:outline-none"
          />
          <div className="flex gap-3">
            <button type="submit" className="flex-1 py-3 bg-black text-white text-sm font-black uppercase tracking-wider border border-black hover:bg-white hover:text-black transition-all cursor-pointer">Save</button>
            <button type="button" onClick={() => setAddingTask(false)} className="px-6 py-3 bg-white text-black text-sm font-black uppercase tracking-wider border border-black hover:bg-black hover:text-white transition-all cursor-pointer">Cancel</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setAddingTask(true)} className="w-full flex items-center justify-between p-4 bg-white hover:bg-black hover:text-white transition-colors border border-black group relative z-10 cursor-pointer shadow-lg">
          <span className="font-black tracking-tight text-lg uppercase group-hover:translate-x-1 transition-transform">New Task</span>
          <div className="text-current flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
            <Plus size={24} strokeWidth={3} />
          </div>
        </button>
      )}
    </div>
  )
}
