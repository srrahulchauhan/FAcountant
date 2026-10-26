import React, { useState, useEffect } from 'react'
import { useFinancial } from '../context/FinancialContext'

export const BudgetForm = ({ onSubmit, onCancel }) => {
  const { budgets, categories } = useFinancial()

  const [overallBudget, setOverallBudget] = useState(budgets?.monthlyOverallBudget || 80000)
  const [categoryBudgets, setCategoryBudgets] = useState(budgets?.categoryBudgets || {})

  useEffect(() => {
    if (budgets) {
      setOverallBudget(budgets.monthlyOverallBudget || 80000)
      setCategoryBudgets(budgets.categoryBudgets || {})
    }
  }, [budgets])

  const handleCategoryAmountChange = (catName, amount) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [catName]: Number(amount) || 0
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      monthlyOverallBudget: Number(overallBudget) || 0,
      categoryBudgets
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Overall Budget */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Total Overall Monthly Budget (₹) <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
          <input
            type="number"
            step="any"
            min="1000"
            required
            value={overallBudget}
            onChange={(e) => setOverallBudget(e.target.value)}
            className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-base font-bold outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          You will receive in-app alerts when overall spending reaches 80% and 100%.
        </p>
      </div>

      {/* Category Budgets List */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Category Limits (Optional)
        </h4>
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const currentVal = categoryBudgets[cat.name] !== undefined ? categoryBudgets[cat.name] : (cat.monthlyBudget || 0)
            return (
              <div key={cat.id} className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color || '#6366f1' }} />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{cat.name}</span>
                </div>
                <div className="relative w-36">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={currentVal}
                    onChange={(e) => handleCategoryAmountChange(cat.name, e.target.value)}
                    className="w-full pl-6 pr-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-right outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all active:scale-95"
        >
          Save Budget Targets
        </button>
      </div>
    </form>
  )
}
