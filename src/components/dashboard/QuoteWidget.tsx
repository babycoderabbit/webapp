'use client'
import { useState, useEffect } from 'react'
import { RefreshCw, Sparkles } from 'lucide-react'
import { quotes } from '@/lib/quotes'

export function QuoteWidget() {
  const [index, setIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIndex(Math.floor(Math.random() * quotes.length))
    setMounted(true)
  }, [])

  return (
    <div className="relative bg-white border border-black p-8 shadow-lg group mb-8">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="p-2 text-black">
          <Sparkles size={28} />
        </div>
        <button 
          onClick={() => setIndex((index + 1) % quotes.length)} 
          className="text-black hover:bg-black hover:text-white transition-colors p-2 border border-transparent hover:border-black cursor-pointer"
        >
          <RefreshCw size={24} />
        </button>
      </div>
      
      <p suppressHydrationWarning className={`text-2xl md:text-3xl font-black text-black leading-tight tracking-tighter uppercase relative z-10 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        &quot;{quotes[index]}&quot;
      </p>
    </div>
  )
}
