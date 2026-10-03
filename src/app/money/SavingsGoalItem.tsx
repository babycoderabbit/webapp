'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { SavingsGoal } from '@prisma/client';

import { useState } from 'react'
import { Trash2, Edit2, Check, X } from 'lucide-react'

export function SavingsGoalItem({ goal, onDelete, onEdit, onAddFunds }: any) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(goal.title)
  const [targetAmount, setTargetAmount] = useState(goal.targetAmount)
  const [targetDate, setTargetDate] = useState(goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : '')

  const handleSave = async () => {
    await onEdit(goal.id, title, Number(targetAmount), targetDate ? new Date(targetDate) : null)
    setIsEditing(false)
  }

  const handleAddFunds = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const addAmt = parseFloat(formData.get('addAmount') as string)
    if (addAmt) {
      await onAddFunds(goal.id, goal.currentAmount + addAmt)
      e.currentTarget.reset()
    }
  }

  const formatNaira = (amount: number) => `₦${Number(amount).toFixed(2)}`
  const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))

  if (isEditing) {
    return (
      <div className="p-4 bg-white border border-black flex flex-col gap-3">
        <div className="flex-1 w-full flex flex-col gap-2">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Goal Title" className="border border-black p-2 font-bold w-full bg-white text-black outline-none" />
          <input type="number" step="0.01" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="Target Amount" className="border border-black p-2 font-bold w-full bg-white text-black outline-none tabular-nums" />
          <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="border border-black p-2 font-bold w-full bg-white text-black outline-none" />
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <button onClick={handleSave} className="p-2 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><Check size={16} /></button>
          <button onClick={() => setIsEditing(false)} className="p-2 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><X size={16} /></button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white border border-black flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-black text-lg uppercase">{goal.title}</span>
          {goal.targetDate && <span className="text-xs font-bold tracking-widest uppercase" suppressHydrationWarning>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsEditing(true)} className="p-2 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"><Edit2 size={16}/></button>
          <button onClick={() => onDelete(goal.id)} className="p-2 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"><Trash2 size={16}/></button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center font-bold text-sm uppercase tracking-widest mt-2 gap-1 sm:gap-4">
        <span>{formatNaira(goal.currentAmount)} saved</span>
        <span className="text-blue-600 dark:text-blue-400">{formatNaira(Math.max(0, goal.targetAmount - goal.currentAmount))} remaining</span>
        <span>{formatNaira(goal.targetAmount)} goal</span>
      </div>
      <div className="w-full border border-black h-6 bg-white relative">
        <div className="h-full bg-black" style={{ width: `${percent}%` }}></div>
      </div>
      
      <form onSubmit={handleAddFunds} className="flex flex-col sm:flex-row gap-3 mt-2">
         <input type="number" step="0.01" name="addAmount" required placeholder="Amount (₦)" className="w-full sm:w-auto flex-1 bg-white border border-black p-2 font-bold tabular-nums focus:outline-none min-w-0" />
         <button type="submit" className="w-full sm:w-auto bg-black text-white px-4 py-2 font-black uppercase border border-black hover:bg-white hover:text-black transition-all cursor-pointer whitespace-nowrap">
           Add Funds
         </button>
      </form>
    </div>
  )
}
