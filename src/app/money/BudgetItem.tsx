'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Budget } from '@prisma/client';

import { useState } from 'react'
import { Trash2, Edit2, Check, X } from 'lucide-react'

export function BudgetItem({ budget, spent, onDelete, onEdit }: any) {
  const [isEditing, setIsEditing] = useState(false)
  const [category, setCategory] = useState(budget.category)
  const [monthlyLimit, setMonthlyLimit] = useState(budget.monthlyLimit)
  const [month, setMonth] = useState(budget.month)

  const handleSave = async () => {
    await onEdit(budget.id, category, Number(monthlyLimit), month)
    setIsEditing(false)
  }

  const formatNaira = (amount: number) => `₦${Number(amount).toFixed(2)}`
  const percent = Math.min(100, Math.round((spent / budget.monthlyLimit) * 100))

  if (isEditing) {
    return (
      <div className="p-4 bg-white border-2 border-black flex flex-col gap-3">
        <div className="flex-1 w-full flex flex-col gap-2">
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="border-2 border-black p-2 font-bold w-full bg-white text-black outline-none" />
          <input type="number" step="0.01" value={monthlyLimit} onChange={(e) => setMonthlyLimit(e.target.value)} placeholder="Limit" className="border-2 border-black p-2 font-bold w-full bg-white text-black outline-none tabular-nums" />
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="border-2 border-black p-2 font-bold w-full bg-white text-black outline-none" />
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <button onClick={handleSave} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><Check size={16} /></button>
          <button onClick={() => setIsEditing(false)} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><X size={16} /></button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white border-2 border-black flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="font-black text-lg uppercase">{budget.category} <span className="text-xs">({budget.month})</span></span>
        <div className="flex gap-2">
          <button onClick={() => setIsEditing(true)} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors cursor-pointer"><Edit2 size={16}/></button>
          <button onClick={() => onDelete(budget.id)} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors cursor-pointer"><Trash2 size={16}/></button>
        </div>
      </div>
      <div className="flex justify-between items-center font-bold text-sm uppercase tracking-widest">
        <span>{formatNaira(spent)} spent</span>
        <span>{formatNaira(budget.monthlyLimit)} limit</span>
      </div>
      <div className="w-full border-2 border-black h-6 bg-white relative">
        <div className="h-full bg-black" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  )
}
