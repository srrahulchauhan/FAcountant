import React from 'react'
import { Link } from 'react-router-dom'
import { formatINR } from '../../utils/currency'
import { AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react'

export const BudgetProgressSection = ({
  budgets = {},
  categories = [],
  monthlyExpenses = 0,
  categoryBreakdown = []
}) => {
  const overallBudget = Number(budgets?.monthlyOverallBudget) || 0
  const overallUsage = overallBudget > 0 ? (monthlyExpenses / overallBudget) * 100 : 0
  const isOverallExceeded = overallUsage >= 100
  const isOverallWarning = overallUsage >= 80 && overallUsage < 100

  // Category items that have a budget set
  const budgetedCategories = categories
    .filter(c => Number(c.monthlyBudget) > 0 || (budgets.categoryBudgets && Number(budgets.categoryBudgets[c.name]) > 0))
    .map(c => {
      const budget = Number(budgets?.categoryBudgets?.[c.name] !== undefined ? budgets.categoryBudgets[c.name] : c.monthlyBudget)
      const found = categoryBreakdown.find(b => b.name === c.name)
      const spent = found ? found.amount : 0
      const usage = budget > 0 ? (spent / budget) * 100 : 0
      return {
        id: c.id,
        name: c.name,
        color: c.color || '#6366f1',
        budget,
        spent,
        usage,
        isExceeded: usage >= 100,
        isWarning: usage >= 80 && usage < 100
      }
    })
    .sort((a, b) => b.usage - a.usage)

  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
            Monthly Budget Health
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time tracking of overall and category limits
          </p>
        </div>
        <Link
          to="/budgets"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
        >
          Manage
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Overall Budget Card */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Overall Monthly Limit
          </span>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="font-bold text-slate-900 dark:text-white">{formatINR(monthlyExpenses)}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-500">{formatINR(overallBudget)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverallExceeded
                ? 'bg-rose-500'
                : isOverallWarning
                ? 'bg-amber-500'
                : 'bg-indigo-600'
            }`}
            style={{ width: `${Math.min(100, overallUsage)}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-2 text-[11px]">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            {overallBudget > monthlyExpenses
              ? `${formatINR(overallBudget - monthlyExpenses)} remaining`
              : `${formatINR(monthlyExpenses - overallBudget)} over budget`}
          </span>
          {isOverallExceeded ? (
            <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
              <ShieldAlert className="w-3.5 h-3.5" /> Exceeded ({overallUsage.toFixed(0)}%)
            </span>
          ) : isOverallWarning ? (
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
              <AlertTriangle className="w-3.5 h-3.5" /> 80%+ Limit ({overallUsage.toFixed(0)}%)
            </span>
          ) : (
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {overallUsage.toFixed(0)}% used
            </span>
          )}
        </div>
      </div>

      {/* Top 3 Category Budgets */}
      <div className="space-y-3">
        {budgetedCategories.slice(0, 3).map((item) => (
          <div key={item.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
              </div>
              <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                {formatINR(item.spent)} / {formatINR(item.budget)}
              </span>
            </div>

            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  item.isExceeded ? 'bg-rose-500' : item.isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, item.usage)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
