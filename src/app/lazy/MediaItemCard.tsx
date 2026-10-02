'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MediaItem } from '@prisma/client'
import { useState } from 'react'
import { Trash2, Edit2, Check, X } from 'lucide-react'

export function MediaItemCard({ item, onDelete, onEdit }: { item: MediaItem, onDelete: (id: string) => void, onEdit: (id: string, title: string, status: string) => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(item.title)
  const [status, setStatus] = useState(item.status || 'PLANNING')

  const handleSave = async () => {
    await onEdit(item.id, title, status)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="bg-white border border-black flex flex-col justify-between p-4 aspect-[3/4] rounded-none">
        <div className="space-y-3">
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="border border-black p-2 text-sm font-bold w-full bg-white text-black outline-none"
            placeholder="Title"
          />
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="border border-black p-2 text-sm font-bold w-full bg-white text-black outline-none"
          >
            <option value="PLANNING">Planning</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="DROPPED">Dropped</option>
          </select>
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <button onClick={handleSave} className="p-2 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><Check size={16} /></button>
          <button onClick={() => setIsEditing(false)} className="p-2 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><X size={16} /></button>
        </div>
      </div>
    )
  }

  return (
    <div className="group bg-white border border-black flex flex-col justify-between p-4 aspect-[3/4] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] transition-all rounded-none">
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 border border-black bg-white text-black">{item.status}</span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
            <button onClick={() => setIsEditing(true)} className="p-1.5 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer">
              <Edit2 size={14}/>
            </button>
            <button onClick={() => onDelete(item.id)} className="p-1.5 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer text-red-600 hover:text-red-600">
              <Trash2 size={14}/>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <h3 className="font-extrabold text-black leading-tight line-clamp-2 uppercase">{item.title}</h3>
        {item.genre && <p className="text-xs font-bold text-black mt-1 uppercase">{item.genre}</p>}
        {item.releaseYear && <p className="text-[10px] font-bold text-black/70 uppercase tracking-wider mt-2">{item.releaseYear} {item.country ? `• ${item.country}` : ''}</p>}
      </div>
    </div>
  )
}
