import React, { useState, useEffect } from 'react'
import { PaymentMethodSelect } from '../components/common/PaymentMethodSelect'
import { formatInputDate } from '../utils/dateUtils'

export const IncomeForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: formatInputDate(new Date()),
    source: '',
    paymentMethod: 'Bank Transfer',
    notes: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        date: formatInputDate(initialData.date || new Date()),
        source: initialData.source || '',
        paymentMethod: initialData.paymentMethod || 'Bank Transfer',
        notes: initialData.notes || ''
      })
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    const amt = Number(formData.amount)
    if (isNaN(amt) || amt <= 0) return

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Income Title <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="e.g. October Salary, Freelance Web App, Dividend"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Amount & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Amount (₹) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
              ₹
            </span>
            <input
              type="number"
              step="any"
              min="0.01"
              required
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Received Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Source & Payment Method */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Income Source / Employer
          </label>
          <input
            type="text"
            placeholder="e.g. Employer Name, Client, Stock Broker"
            value={formData.source}
            onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Payment Method
          </label>
          <PaymentMethodSelect
            value={formData.paymentMethod}
            onChange={(val) => setFormData(prev => ({ ...prev, paymentMethod: val }))}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Notes (Optional)
        </label>
        <textarea
          rows={2}
          placeholder="Additional details..."
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
        />
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
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-500/20 transition-all active:scale-95"
        >
          {initialData ? 'Update Income' : 'Record Income'}
        </button>
      </div>
    </form>
  )
}
