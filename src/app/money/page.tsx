import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { addTransaction, deleteTransaction, updateTransaction, addBudget, deleteBudget, updateBudget, addSavingsGoal, deleteSavingsGoal, updateSavingsGoal, updateSavingsGoalProgress } from '@/app/actions/money'
import { TrendingUp, TrendingDown, Wallet, Plus, Target, PiggyBank } from 'lucide-react'
import { TransactionItem } from './TransactionItem'
import { BudgetItem } from './BudgetItem'
import { SavingsGoalItem } from './SavingsGoalItem'

export default async function MoneyPage() {
  const session = await auth()
  let userId = session?.user?.id
  if (!userId) {
    const firstUser = await prisma.user.findFirst()
    if (firstUser) userId = firstUser.id
    else redirect('/login')
  }

  const transactions = await prisma.transaction.findMany({ where: { userId }, orderBy: { date: 'desc' } })
  const budgets = await prisma.budget.findMany({ where: { userId } })
  const savingsGoals = await prisma.savingsGoal.findMany({ where: { userId } })

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0)
  const netSavings = totalIncome - totalExpense

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount)
    const eur = (absAmount / 1600).toFixed(2)
    const gbp = (absAmount / 1900).toFixed(2)
    return `₦${absAmount.toFixed(2)} (€${eur} / £${gbp})`
  }


  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto bg-white text-black">
      <header className="border-2 border-black p-6 md:p-8 bg-white shadow-[4px_4px_0_0_#000000] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 font-black tracking-widest uppercase text-xs mb-2">
            <Wallet size={16} /> Finance
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Money</h1>
          <p className="font-bold mt-2 uppercase tracking-widest text-sm">Track your wealth and expenses.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0_0_#000000] flex flex-col items-start relative group">
          <div className="p-3 border-2 border-black rounded-none mb-4"><TrendingUp size={32} /></div>
          <div className="font-black text-sm uppercase tracking-wider mb-1">Monthly Income</div>
          <div className="text-xl md:text-2xl font-black tabular-nums break-words w-full">{formatCurrency(totalIncome)}</div>
        </div>
        
        <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0_0_#000000] flex flex-col items-start relative group">
          <div className="p-3 border-2 border-black rounded-none mb-4"><TrendingDown size={32} /></div>
          <div className="font-black text-sm uppercase tracking-wider mb-1">Monthly Expenses</div>
          <div className="text-xl md:text-2xl font-black tabular-nums break-words w-full">{formatCurrency(totalExpense)}</div>
        </div>
        
        <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0_0_#000000] flex flex-col items-start relative group">
          <div className="p-3 border-2 border-black rounded-none mb-4"><Wallet size={32} /></div>
          <div className="font-black text-sm uppercase tracking-wider mb-1">Net Savings</div>
          <div className="text-xl md:text-2xl font-black tabular-nums flex flex-wrap items-center gap-1 break-words w-full">
            {netSavings < 0 && '-'}
            {formatCurrency(netSavings)}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          
          <div className="border-2 border-black bg-white p-6 md:p-8 shadow-[4px_4px_0_0_#000000]">
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-6 flex items-center gap-2 border-b-4 border-black pb-4"><TrendingUp size={28} /> Ledger</h2>
            {transactions.length === 0 ? (
               <div className="font-bold text-sm text-center py-10 border-2 border-black">No transactions recorded.</div>
            ) : (
              <div className="space-y-4">
                {transactions.map(t => (
                  <TransactionItem
                    key={t.id}
                    transaction={t}
                    onDelete={async (id: string) => { 'use server'; await deleteTransaction(id) }}
                    onEdit={async (id: string, type: string, amount: number, category: string, description: string) => { 'use server'; await updateTransaction(id, type, amount, category, description) }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="border-2 border-black bg-white p-6 md:p-8 shadow-[4px_4px_0_0_#000000]">
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-6 flex items-center gap-2 border-b-4 border-black pb-4"><Target size={28} /> Budgets</h2>
            
            <form action={async (formData) => { 'use server'; await addBudget(formData) }} className="mb-6 flex flex-col xl:flex-row gap-3">
              <input type="text" name="category" required placeholder="Category" className="w-full xl:w-auto flex-1 bg-white border-2 border-black p-3 font-bold focus:outline-none min-w-0" />
              <input type="number" step="0.01" name="monthlyLimit" required placeholder="Limit (₦)" className="w-full xl:w-auto flex-1 bg-white border-2 border-black p-3 font-bold tabular-nums focus:outline-none min-w-0" />
              <input type="month" name="month" required className="w-full xl:w-auto flex-1 bg-white border-2 border-black p-3 font-bold focus:outline-none cursor-pointer min-w-0" />
              <button type="submit" className="w-full xl:w-auto bg-black text-white px-6 py-3 font-black uppercase border-2 border-black hover:bg-white hover:text-black transition-all cursor-pointer whitespace-nowrap">
                Add
              </button>
            </form>

            {budgets.length === 0 ? (
               <div className="font-bold text-sm text-center py-10 border-2 border-black">No budgets recorded.</div>
            ) : (
              <div className="space-y-4">
                {budgets.map(b => {
                  const spent = transactions.filter(t => t.type === 'EXPENSE' && t.category.toLowerCase() === b.category.toLowerCase() && t.date.toISOString().startsWith(b.month)).reduce((sum, t) => sum + t.amount, 0)
                  return (
                    <BudgetItem
                      key={b.id}
                      budget={b}
                      spent={spent}
                      onDelete={async (id: string) => { 'use server'; await deleteBudget(id) }}
                      onEdit={async (id: string, category: string, monthlyLimit: number, month: string) => { 'use server'; await updateBudget(id, category, monthlyLimit, month) }}
                    />
                  )
                })}
              </div>
            )}
          </div>

          <div className="border-2 border-black bg-white p-6 md:p-8 shadow-[4px_4px_0_0_#000000]">
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-6 flex items-center gap-2 border-b-4 border-black pb-4"><PiggyBank size={28} /> Savings Goals</h2>
            
            <form action={async (formData) => { 'use server'; await addSavingsGoal(formData) }} className="mb-6 flex flex-col xl:flex-row gap-3">
              <input type="text" name="title" required placeholder="Goal Title" className="w-full xl:w-auto flex-1 bg-white border-2 border-black p-3 font-bold focus:outline-none min-w-0" />
              <input type="number" step="0.01" name="targetAmount" required placeholder="Target (₦)" className="w-full xl:w-auto flex-1 bg-white border-2 border-black p-3 font-bold tabular-nums focus:outline-none min-w-0" />
              <input type="date" name="targetDate" className="w-full xl:w-auto flex-1 bg-white border-2 border-black p-3 font-bold focus:outline-none cursor-pointer min-w-0" />
              <button type="submit" className="w-full xl:w-auto bg-black text-white px-6 py-3 font-black uppercase border-2 border-black hover:bg-white hover:text-black transition-all cursor-pointer whitespace-nowrap">
                Add
              </button>
            </form>

            {savingsGoals.length === 0 ? (
               <div className="font-bold text-sm text-center py-10 border-2 border-black">No savings goals recorded.</div>
            ) : (
              <div className="space-y-4">
                {savingsGoals.map(g => (
                  <SavingsGoalItem
                    key={g.id}
                    goal={g}
                    onDelete={async (id: string) => { 'use server'; await deleteSavingsGoal(id) }}
                    onEdit={async (id: string, title: string, targetAmount: number, targetDate: Date | null) => { 'use server'; await updateSavingsGoal(id, title, targetAmount, targetDate) }}
                    onAddFunds={async (id: string, newAmount: number) => { 'use server'; await updateSavingsGoalProgress(id, newAmount) }}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="bg-white border-2 border-black shadow-[4px_4px_0_0_#000000] p-6 md:p-8 h-fit sticky top-6">
          <h2 className="text-2xl font-black tracking-tighter uppercase mb-6 flex items-center gap-2 border-b-4 border-black pb-4"><Plus size={28} /> Log Transaction</h2>
          <form action={async (formData) => { 'use server'; await addTransaction(formData) }} className="space-y-4">
            <div className="bg-white p-4 border-2 border-black space-y-4">
              <div>
                <label className="block text-sm font-black uppercase tracking-wider mb-2">Type</label>
                <select name="type" className="w-full bg-white border-2 border-black p-3 font-bold focus:outline-none cursor-pointer">
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-black uppercase tracking-wider mb-2">Amount (₦)</label>
                <input type="number" step="0.01" name="amount" required placeholder="0.00" className="w-full bg-white border-2 border-black p-3 text-lg font-black tabular-nums focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-black uppercase tracking-wider mb-2">Category</label>
                <input type="text" name="category" required placeholder="e.g. Groceries" className="w-full bg-white border-2 border-black p-3 font-bold focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-black uppercase tracking-wider mb-2">Description</label>
                <input type="text" name="description" placeholder="Optional notes" className="w-full bg-white border-2 border-black p-3 font-bold focus:outline-none" />
              </div>
            </div>
            <button type="submit" className="w-full bg-black text-white px-6 py-4 font-black text-lg uppercase tracking-widest hover:bg-white hover:text-black border-2 border-black transition-all cursor-pointer">
              Save Entry
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

