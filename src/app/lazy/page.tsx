import React from 'react'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { addMedia, deleteMedia, updateMediaItem } from '@/app/actions/lazy'
import { Film, Gamepad2, Book, Tv } from 'lucide-react'
import { MediaItemCard } from './MediaItemCard'
import { MediaItem } from '@prisma/client'
import { SubmitButton } from '@/components/SubmitButton'

const MediaSection = ({ title, items, Icon }: { title: string, items: MediaItem[], Icon: React.ElementType }) => (
  <div className="bg-card/40 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-xl mb-8">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
    </div>
    
    {items.length === 0 ? (
      <div className="text-muted text-sm text-center py-8 bg-background/30 rounded-2xl border border-border/50">No items added to backlog.</div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(m => (
          <MediaItemCard 
            key={m.id} 
            item={m} 
            onDelete={deleteMedia} 
            onEdit={updateMediaItem} 
          />
        ))}
      </div>
    )}
  </div>
)

export default async function LazyPage() {
  const session = await auth()
  let userId = session?.user?.id
  if (!userId) {
    const firstUser = await prisma.user.findFirst()
    if (firstUser) userId = firstUser.id
    else redirect('/login')
  }

  const media = await prisma.mediaItem.findMany({ where: { userId } })
  const movies = media.filter(m => m.type === 'MOVIE' || m.type === 'SERIES')
  const games = media.filter(m => m.type === 'GAME')
  const books = media.filter(m => m.type === 'BOOK')

  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <header className="bg-card/30 p-6 md:p-8 rounded-[2rem] border border-border backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-semibold tracking-widest uppercase text-xs mb-2">
            <Tv size={16} /> Entertainment
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">Lazy Mode</h1>
          <p className="text-muted font-medium mt-2">Manage your media backlog.</p>
        </div>
        
        <form action={async (formData) => { 'use server'; await addMedia(formData) }} className="w-full md:w-auto bg-background/80 p-3 rounded-2xl border border-border shadow-inner space-y-3">
          <div className="flex gap-2">
            <input type="text" name="title" required placeholder="Title" className="bg-card border border-border/50 rounded-xl p-2.5 text-sm text-foreground focus:outline-none flex-[2] min-w-0" />
            <select name="type" className="bg-card border border-border/50 rounded-xl p-2.5 text-sm text-foreground focus:outline-none flex-1 min-w-0">
              <option value="MOVIE">Movie/TV</option>
              <option value="GAME">Game</option>
              <option value="BOOK">Book</option>
            </select>
          </div>
          <div className="flex gap-2">
             <input type="text" name="genre" placeholder="Genre" className="bg-card border border-border/50 rounded-xl p-2.5 text-xs text-foreground focus:outline-none flex-1 min-w-0" />
             <input type="number" name="releaseYear" placeholder="Year" className="bg-card border border-border/50 rounded-xl p-2.5 text-xs text-foreground focus:outline-none w-16 min-w-0" />
             <SubmitButton className="bg-primary text-background px-3 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all">Save</SubmitButton>
          </div>
        </form>
      </header>

      <MediaSection title="Watchlist" items={movies} Icon={Film} />
      <MediaSection title="Game Backlog" items={games} Icon={Gamepad2} />
      <MediaSection title="Reading List" items={books} Icon={Book} />
    </div>
  )
}
