import React, { useState, useMemo } from 'react'
import { useFinancial } from '../context/FinancialContext'
import { formatINR } from '../utils/currency'
import { Modal } from '../components/common/Modal'
import { BudgetForm } from '../forms/BudgetForm'
import {
  PieChart,
  Edit2,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  Target,
  Sparkles
} from 'lucide-react'

export const Budgets = () => {
  const {
    budgets,
    categories,
    expenses,
    updateBudgets
  } = useFinancial()

  const [isEditOpen, setIsEditOpen] = useState(false)

  // Current calendar month key
  const currentMonthKey = new Date().toISOString().slice(0, 7) // 'YYYY-MM'

  // Monthly paid expenses
  const currentMonthExpenses = useMemo(() => {
    return expenses.filter(e =>
      (e.paymentStatus || 'Paid').toLowerCase() === 'paid' &&
      e.date && e.date.startsWith(currentMonthKey)
    )
  }, [expenses, currentMonthKey])

  const totalSpentThisMonth = useMemo(() => {
    return currentMonthExpenses.reduce((a, b) => a + Number(b.amount || 0), 0)
  }, [currentMonthExpenses])

  const overallBudget = Number(budgets?.monthlyOverallBudget) || 0
  const overallUsage = overallBudget > 0 ? (totalSpentThisMonth / overallBudget) * 100 : 0
  const overallRemaining = Math.max(0, overallBudget - totalSpentThisMonth)

  // Category budget items
  const categoryBudgetRows = useMemo(() => {
    const spendingMap = {}
    currentMonthExpenses.forEach(exp => {
      const key = exp.categoryName || 'Other'
      spendingMap[key] = (spendingMap[key] || 0) + Number(exp.amount || 0)
    })

    return categories.map(cat => {
      const budgetAmount = Number(
        budgets?.categoryBudgets?.[cat.name] !== undefined
          ? budgets.categoryBudgets[cat.name]
          : (cat.monthlyBudget || 0)
      )
      const spent = spendingMap[cat.name] || 0
      const remaining = Math.max(0, budgetAmount - spent)
      const usage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0
      const isExceeded = usage >= 100
      const isWarning = usage >= 80 && usage < 100

      return {
        id: cat.id,
        name: cat.name,
        color: cat.color || '#6366f1',
        budgetAmount,
        spent,
        remaining,
        usage,
        isExceeded,
        isWarning
      }
    })
  }, [categories, currentMonthExpenses, budgets])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Budgets & Financial Targets
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Set overall spending ceilings and category thresholds with proactive alerts
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto active:scale-95"
        >
          <Edit2 className="w-4 h-4" />
          <span>Edit Budgets</span>
        </button>
      </div>

      {/* Overall Budget Hero Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-md">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md">
              <Target className="w-3.5 h-3.5" />
              Monthly Overall Budget Target
            </span>
            <div className="flex items-baseline gap-3">
              <h3 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight font-mono">
                {formatINR(totalSpentThisMonth)}
              </h3>
              <span className="text-lg text-indigo-200 font-mono">
                / {formatINR(overallBudget)}
              </span>
            </div>
            <p className="text-xs text-indigo-100">
              {overallUsage >= 100 ? (
                <span className="text-rose-300 font-bold flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4" /> You have exceeded your monthly limit by {formatINR(totalSpentThisMonth - overallBudget)}!
                </span>
              ) : overallUsage >= 80 ? (
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Caution: You have consumed {overallUsage.toFixed(0)}% of your budget limit.
                </span>
              ) : (
                <span className="text-emerald-300 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Excellent! {formatINR(overallRemaining)} safe spending capacity remaining.
                </span>
              )}
            </p>
          </div>

          <div className="text-right">
            <div className="inline-flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-sm">
              <span className="text-2xl font-black font-mono">{overallUsage.toFixed(0)}%</span>
              <span className="text-[10px] uppercase font-bold text-indigo-200">Used</span>
            </div>
          </div>
        </div>

        {/* Progress Bar inside Hero */}
        <div className="relative z-10 mt-6 w-full h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              overallUsage >= 100
                ? 'bg-rose-400'
                : overallUsage >= 80
                ? 'bg-amber-400'
                : 'bg-emerald-400'
            }`}
            style={{ width: `${Math.min(100, overallUsage)}%` }}
          />
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div>
        <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white mb-3">
          Category Spending Targets
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryBudgetRows.map((cat) => {
            const hasBudget = cat.budgetAmount > 0

            return (
              <div
                key={cat.id}
                onClick={() => setIsEditOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditOpen(true)
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 cursor-pointer hover:border-indigo-500/50 hover:shadow-md transition-all active:scale-[0.99] select-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {cat.name}
                      </h4>
                    </div>

                    {hasBudget && (
                      <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                        cat.isExceeded
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                          : cat.isWarning
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                          : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                      }`}>
                        {cat.usage.toFixed(0)}%
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-baseline text-xs text-slate-500 dark:text-slate-400 font-mono mt-3">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Spent This Month</span>
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        {formatINR(cat.spent)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Budget Limit</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {hasBudget ? formatINR(cat.budgetAmount) : 'Not Set'}
                      </span>
                    </div>
                  </div>
                </div>

                {hasBudget ? (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          cat.isExceeded
                            ? 'bg-rose-500'
                            : cat.isWarning
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, cat.usage)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>{cat.isExceeded ? 'Exceeded by' : 'Remaining'}</span>
                      <span className={`font-mono font-bold ${cat.isExceeded ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}`}>
                        {formatINR(cat.isExceeded ? cat.spent - cat.budgetAmount : cat.remaining)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(true)}
                    className="w-full py-1.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-slate-500 hover:text-indigo-600 text-xs font-semibold transition-colors"
                  >
                    + Set Category Budget
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Edit Budget Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Configure Monthly Budgets"
        subtitle="Set overall maximum budget and optional category limits"
      >
        <BudgetForm
          onSubmit={(newBudgets) => {
            updateBudgets(newBudgets)
            setIsEditOpen(false)
          }}
          onCancel={() => setIsEditOpen(false)}
        />
      </Modal>
    </div>
  )
}
