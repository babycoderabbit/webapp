import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { addWord, deleteWord, createDocument, deleteDocument, updateDictionaryEntry, updateWritingDocument } from '@/app/actions/writing'
import { BookA, FileText, Plus } from 'lucide-react'
import { DocumentItem } from './DocumentItem'
import { DictionaryEntryItem } from './DictionaryEntryItem'

export default async function WritingPage() {
  const session = await auth()
  let userId = session?.user?.id
  if (!userId) {
    const firstUser = await prisma.user.findFirst()
    if (firstUser) userId = firstUser.id
    else redirect('/login')
  }

  const words = await prisma.dictionaryEntry.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  const docs = await prisma.writingDocument.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } })

  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <header className="bg-card/30 p-6 md:p-8 rounded-[2rem] border border-border backdrop-blur-xl">
        <div className="flex items-center gap-3 text-primary font-semibold tracking-widest uppercase text-xs mb-3">
          <FileText size={18} /> Creative Space
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">Writing Studio</h1>
        <p className="text-muted font-medium mt-2">Your private documents and personal lexicon.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Documents */}
        <div className="bg-card/40 backdrop-blur-xl border border-border rounded-3xl p-6 md:p-8 shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2"><FileText size={20} className="text-primary"/> Documents</h2>
            <form action={async () => { 'use server'; await createDocument() }}>
              <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary px-4 py-2 rounded-xl hover:bg-primary hover:text-background transition-all">
                <Plus size={14} /> New
              </button>
            </form>
          </div>
          
          {docs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 bg-background/30 rounded-2xl border border-border/50 text-center">
              <FileText size={48} className="text-muted mb-4" />
              <p className="text-muted text-sm font-medium">No documents yet.<br/>Start drafting your ideas.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2 flex-1">
              {docs.map(doc => (
                <DocumentItem 
                  key={doc.id} 
                  doc={doc} 
                  onDelete={deleteDocument} 
                  onEdit={updateWritingDocument} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Dictionary */}
        <div className="bg-card/40 backdrop-blur-xl border border-border rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <BookA size={20} className="text-primary" />
            <h2 className="text-xl font-bold tracking-tight">Lexicon</h2>
          </div>
          
          <form action={async (formData) => { 'use server'; await addWord(formData) }} className="mb-6 bg-background/50 p-3 rounded-2xl border border-border flex flex-col sm:flex-row gap-3">
            <input name="word" type="text" placeholder="Word" required className="bg-transparent border-none p-2 text-sm font-bold text-foreground focus:outline-none flex-1 min-w-0" />
            <div className="w-full sm:w-px bg-border h-px sm:h-auto"></div>
            <input name="meaning" type="text" placeholder="Definition..." required className="bg-transparent border-none p-2 text-sm text-foreground focus:outline-none flex-[2] min-w-0" />
            <button type="submit" className="bg-foreground text-background px-4 py-2 rounded-xl font-bold text-sm hover:opacity-90 shrink-0">Save</button>
          </form>
          
          <div className="space-y-3 h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {words.length === 0 ? (
               <div className="text-muted text-sm text-center py-10 bg-background/30 rounded-2xl border border-border/50">Your dictionary is empty.</div>
            ) : (
              words.map(w => (
                <DictionaryEntryItem 
                  key={w.id} 
                  entry={w} 
                  onDelete={deleteWord} 
                  onEdit={updateDictionaryEntry} 
                />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
