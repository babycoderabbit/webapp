'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { DictionaryEntry } from '@prisma/client';

import { useState } from 'react'
import { Trash2, Edit3, Check, X } from 'lucide-react'

export function DictionaryEntryItem({ entry, onDelete, onEdit }: any) {
  const [isEditing, setIsEditing] = useState(false)
  const [word, setWord] = useState(entry.word)
  const [meaning, setMeaning] = useState(entry.meaning)

  const handleSave = async () => {
    await onEdit(entry.id, word, meaning)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 p-4 border-2 border-black bg-white rounded-none">
        <input 
          type="text" 
          value={word} 
          onChange={(e) => setWord(e.target.value)} 
          className="border-2 border-black p-2 text-sm font-bold w-full bg-white text-black outline-none"
          placeholder="Word"
        />
        <input 
          type="text" 
          value={meaning} 
          onChange={(e) => setMeaning(e.target.value)} 
          className="border-2 border-black p-2 text-sm font-bold w-full bg-white text-black outline-none"
          placeholder="Meaning"
        />
        <div className="flex gap-2 justify-end mt-2">
          <button onClick={handleSave} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><Check size={18} /></button>
          <button onClick={() => setIsEditing(false)} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><X size={18} /></button>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex justify-between items-start p-4 border-2 border-black bg-white hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000000] transition-all rounded-none gap-4">
      <div className="flex-1">
        <div className="font-bold text-black text-lg tracking-tight uppercase">{entry.word}</div>
        <div className="text-sm text-black/80 font-medium leading-relaxed mt-1">{entry.meaning}</div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setIsEditing(true)} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer">
          <Edit3 size={14}/>
        </button>
        <button onClick={() => onDelete(entry.id)} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer text-red-600 hover:text-red-600">
          <Trash2 size={14}/>
        </button>
      </div>
    </div>
  )
}
