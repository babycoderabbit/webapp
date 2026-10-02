'use client'
import { useState } from 'react'
import { RefreshCw, Sparkles } from 'lucide-react'

const quotes = [
  "The only way to do great work is to love what you do.",
  "Discipline equals freedom.",
  "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.",
  "Focus on being productive instead of busy.",
  "Small daily improvements over time lead to stunning results."
]

export function QuoteWidget() {
  const [index, setIndex] = useState(0)

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
      
      <p className="text-2xl md:text-3xl font-black text-black leading-tight tracking-tighter uppercase relative z-10">
        &quot;{quotes[index]}&quot;
      </p>
    </div>
  )
}
