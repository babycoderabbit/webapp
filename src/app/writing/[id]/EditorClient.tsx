// @ts-nocheck
'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Document } from '@prisma/client';
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateDocument } from '@/app/actions/writing'
import { ArrowLeft, Save, Check } from 'lucide-react'

export default function EditorClient({ doc }: { doc: Document }) {
  const router = useRouter()
  const [title, setTitle] = useState(doc.title)
  const [content, setContent] = useState(doc.content)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    await updateDocument(doc.id, title, content)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex justify-between items-center p-4 md:px-8 border-b border-border/50 bg-card/30 backdrop-blur-md sticky top-0 z-20">
        <button onClick={() => router.push('/writing')} className="text-muted hover:text-foreground flex items-center gap-2 font-bold text-sm tracking-widest uppercase transition-colors px-3 py-2 rounded-xl hover:bg-background">
          <ArrowLeft size={16} /> Exit
        </button>
        <button onClick={handleSave} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${saved ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-primary text-background hover:shadow-lg hover:shadow-primary/20'}`}>
          {saved ? <Check size={16} /> : <Save size={16} />}
          <span>{saved ? 'Saved' : 'Save'}</span>
        </button>
      </header>
      
      <div className="flex-1 w-full max-w-4xl mx-auto p-6 md:p-12 flex flex-col gap-6">
        <input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          className="text-4xl md:text-5xl font-black tracking-tighter bg-transparent border-none outline-none text-foreground placeholder-muted/50 focus:ring-0 px-0"
          placeholder="Document Title"
        />
        <textarea 
          value={content}
          onChange={e => setContent(e.target.value)}
          className="flex-1 w-full bg-transparent border-none outline-none text-lg leading-relaxed text-foreground/90 placeholder-muted/30 resize-none font-serif custom-scrollbar px-0 focus:ring-0"
          placeholder="Start writing..."
        />
      </div>
    </div>
  )
}
