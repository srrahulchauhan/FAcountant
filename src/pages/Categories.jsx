import React, { useState, useMemo } from 'react'
import { useFinancial } from '../context/FinancialContext'
import { formatINR } from '../utils/currency'
import { Modal } from '../components/common/Modal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { CategoryForm } from '../forms/CategoryForm'
import { EmptyState } from '../components/common/EmptyState'
import {
  Plus,
  Tags,
  Edit2,
  Trash2,
  PieChart,
  ShieldCheck,
  ShoppingCart,
  ShoppingBag,
  Plane,
  Smartphone,
  Wifi,
  Zap,
  HeartPulse,
  GraduationCap,
  Film,
  Sparkles,
  Home,
  MoreHorizontal,
  Coffee,
  Car,
  Gift,
  Book,
  Camera,
  Dumbbell
} from 'lucide-react'

const ICON_MAP = {
  ShoppingCart,
  ShoppingBag,
  Plane,
  Smartphone,
  Wifi,
  Zap,
  HeartPulse,
  GraduationCap,
  Film,
  Sparkles,
  Home,
  Coffee,
  Car,
  Gift,
  Book,
  Camera,
  Dumbbell,
  MoreHorizontal,
}

export const Categories = () => {
  const {
    categories,
    expenses,
    addCategory,
    updateCategory,
    deleteCategory
  } = useFinancial()

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // Compute total spent per category
  const categoryStats = useMemo(() => {
    const paidExpenses = expenses.filter(e => (e.paymentStatus || 'Paid').toLowerCase() === 'paid')
    const totalAllExpenses = paidExpenses.reduce((a, b) => a + Number(b.amount || 0), 0)

    const spendingMap = {}
    paidExpenses.forEach(exp => {
      const key = exp.categoryName || 'Other'
      spendingMap[key] = (spendingMap[key] || 0) + Number(exp.amount || 0)
    })

    return categories.map(cat => {
      const spent = spendingMap[cat.name] || 0
      const budget = Number(cat.monthlyBudget) || 0
      const percentBudget = budget > 0 ? (spent / budget) * 100 : 0
      const percentTotal = totalAllExpenses > 0 ? (spent / totalAllExpenses) * 100 : 0

      return {
        ...cat,
        spent,
        percentBudget,
        percentTotal
      }
    }).sort((a, b) => b.spent - a.spent)
  }, [categories, expenses])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Category Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customize categories, assign color themes, icons, and monthly budgets
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categoryStats.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] || MoreHorizontal
          const isOverBudget = cat.monthlyBudget > 0 && cat.spent > cat.monthlyBudget

          return (
            <div
              key={cat.id}
              onClick={() => setEditingCategory(cat)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setEditingCategory(cat)
              }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between cursor-pointer hover:border-indigo-500/40 active:scale-[0.99] select-none"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: cat.color || '#6366f1' }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setEditingCategory(cat)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {!cat.isDefault && (
                      <button
                        type="button"
                        onClick={() => setDeletingId(cat.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white truncate">
                  {cat.name}
                </h3>

                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                    <span>Total Spent:</span>
                    <span className="font-extrabold font-mono text-slate-900 dark:text-white text-sm">
                      {formatINR(cat.spent)}
                    </span>
                  </div>

                  {cat.monthlyBudget > 0 && (
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                      <span>Monthly Budget:</span>
                      <span className="font-mono">{formatINR(cat.monthlyBudget)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Budget Progress Bar */}
              {cat.monthlyBudget > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Budget Usage</span>
                    <span className={`font-bold ${isOverBudget ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}`}>
                      {cat.percentBudget.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOverBudget ? 'bg-rose-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${Math.min(100, cat.percentBudget)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create Custom Category"
        subtitle="Choose a distinct icon, color theme, and optional budget"
      >
        <CategoryForm
          onSubmit={(data) => {
            addCategory(data)
            setIsAddOpen(false)
          }}
          onCancel={() => setIsAddOpen(false)}
        />
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={editingCategory !== null}
        onClose={() => setEditingCategory(null)}
        title="Edit Category"
        subtitle="Update name, color theme, or monthly budget"
      >
        <CategoryForm
          initialData={editingCategory}
          onSubmit={(data) => {
            updateCategory(editingCategory.id, data)
            setEditingCategory(null)
          }}
          onCancel={() => setEditingCategory(null)}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          deleteCategory(deletingId)
          setDeletingId(null)
        }}
        title="Delete Category"
        message="Are you sure you want to delete this category? Any existing expenses in this category will be preserved and reassigned to 'Other'."
        confirmText="Delete Category"
      />
    </div>
  )
}
