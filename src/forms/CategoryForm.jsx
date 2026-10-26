import React, { useState, useEffect } from 'react'
import {
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

export const AVAILABLE_ICONS = [
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'Plane', icon: Plane },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Wifi', icon: Wifi },
  { name: 'Zap', icon: Zap },
  { name: 'HeartPulse', icon: HeartPulse },
  { name: 'GraduationCap', icon: GraduationCap },
  { name: 'Film', icon: Film },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Home', icon: Home },
  { name: 'Coffee', icon: Coffee },
  { name: 'Car', icon: Car },
  { name: 'Gift', icon: Gift },
  { name: 'Book', icon: Book },
  { name: 'Camera', icon: Camera },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'MoreHorizontal', icon: MoreHorizontal },
]

export const COLOR_PRESETS = [
  '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
  '#ef4444', '#06b6d4', '#14b8a6', '#6366f1', '#d946ef',
  '#f97316', '#64748b'
]

export const CategoryForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: 'ShoppingCart',
    color: '#10b981',
    monthlyBudget: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        icon: initialData.icon || 'ShoppingCart',
        color: initialData.color || '#10b981',
        monthlyBudget: initialData.monthlyBudget || ''
      })
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Category Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Category Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Dining Out, Fitness, Subscriptions"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Monthly Budget */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Monthly Budget Target (₹) (Optional)
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
          <input
            type="number"
            step="any"
            min="0"
            placeholder="e.g. 15000"
            value={formData.monthlyBudget}
            onChange={(e) => setFormData(prev => ({ ...prev, monthlyBudget: e.target.value }))}
            className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Icon Picker */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Select Icon
        </label>
        <div className="grid grid-cols-6 gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 max-h-40 overflow-y-auto">
          {AVAILABLE_ICONS.map((item) => {
            const Icon = item.icon
            const isSelected = formData.icon === item.name
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, icon: item.name }))}
                className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Color Picker & Presets */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Category Color
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, color }))}
              style={{ backgroundColor: color }}
              className={`w-7 h-7 rounded-full transition-transform ${
                formData.color === color ? 'scale-125 ring-2 ring-offset-2 ring-indigo-500' : 'hover:scale-110'
              }`}
            />
          ))}
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
            title="Custom Color"
          />
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
          {initialData ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  )
}
