// @ts-nocheck
'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Document } from '@prisma/client';

import { useState } from 'react'
import { Trash2, Edit3, Check, X } from 'lucide-react'
import Link from 'next/link'

export function DocumentItem({ doc, onDelete, onEdit }: any) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(doc.title)

  const handleSave = async () => {
    await onEdit(doc.id, title)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-black rounded-none gap-4 bg-white">
        <div className="flex-1 w-full">
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="border border-black p-2 text-sm font-bold w-full bg-white text-black outline-none"
            autoFocus
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="p-2 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><Check size={18} /></button>
          <button onClick={() => setIsEditing(false)} className="p-2 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><X size={18} /></button>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex justify-between items-center p-4 border border-black bg-white hover:-translate-y-1 hover:shadow-lg transition-all rounded-none gap-4">
      <div className="flex flex-col">
        <Link href={`/writing/${doc.id}`} className="font-bold text-black text-sm md:text-base hover:underline">
          {doc.title}
        </Link>
        <span className="text-[11px] font-bold uppercase tracking-wider text-black/70 mt-1">
          {doc.wordCount} words • {new Date(doc.updatedAt).toLocaleDateString()}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setIsEditing(true)} className="p-2 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer">
          <Edit3 size={16}/>
        </button>
        <button onClick={() => onDelete(doc.id)} className="p-2 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer text-red-600 hover:text-red-600">
          <Trash2 size={16}/>
        </button>
      </div>
    </div>
  )
}
