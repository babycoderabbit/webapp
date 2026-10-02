'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Transaction } from '@prisma/client';

import { useState } from 'react'
import { Trash2, Edit2, Check, X } from 'lucide-react'

export function TransactionItem({ transaction, onDelete, onEdit }: any) {
  const [isEditing, setIsEditing] = useState(false)
  const [type, setType] = useState(transaction.type)
  const [amount, setAmount] = useState(transaction.amount)
  const [category, setCategory] = useState(transaction.category)
  const [description, setDescription] = useState(transaction.description || '')

  const handleSave = async () => {
    await onEdit(transaction.id, type, Number(amount), category, description)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-black gap-4">
        <div className="flex-1 w-full flex flex-col gap-2">
          <select value={type} onChange={(e) => setType(e.target.value)} className="border border-black p-2 font-bold w-full bg-white text-black outline-none">
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
          <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="border border-black p-2 font-bold w-full bg-white text-black outline-none tabular-nums" />
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="border border-black p-2 font-bold w-full bg-white text-black outline-none" />
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="border border-black p-2 font-bold w-full bg-white text-black outline-none" />
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="p-2 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><Check size={20} /></button>
          <button onClick={() => setIsEditing(false)} className="p-2 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"><X size={20} /></button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-black hover:translate-x-1 hover:-translate-y-1 hover:shadow-lg transition-all gap-4">
      <div className="flex flex-col">
        <span className="font-black text-lg uppercase">{transaction.description || transaction.category}</span>
        <span className="text-xs font-bold tracking-widest uppercase mt-1 inline-block w-fit" suppressHydrationWarning>{new Date(transaction.date).toLocaleDateString()} • {transaction.category}</span>
      </div>
      <div className="flex items-center gap-4 justify-between sm:justify-end">
        <div className="text-xl font-black tabular-nums">
          {transaction.type === 'INCOME' ? '+' : '-'}₦{Number(transaction.amount).toFixed(2)}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsEditing(true)} className="p-2 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"><Edit2 size={20}/></button>
          <button onClick={() => onDelete(transaction.id)} className="p-2 border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"><Trash2 size={20}/></button>
        </div>
      </div>
    </div>
  )
}
