import React, { useState, useEffect } from 'react'
import { useFinancial } from '../context/FinancialContext'
import { PaymentMethodSelect } from '../components/common/PaymentMethodSelect'
import { formatInputDate } from '../utils/dateUtils'
import { Upload, X, IndianRupee } from 'lucide-react'

export const ExpenseForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  defaultCategoryId = null
}) => {
  const { categories, settings } = useFinancial()

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: formatInputDate(new Date()),
    categoryId: defaultCategoryId || categories[0]?.id || '',
    categoryName: categories[0]?.name || '',
    store: '',
    description: '',
    paymentMethod: settings.defaultPaymentMethod || 'UPI',
    paymentStatus: 'Paid',
    receiptImage: null
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        date: formatInputDate(initialData.date || new Date()),
        categoryId: initialData.categoryId || categories[0]?.id || '',
        categoryName: initialData.categoryName || categories[0]?.name || '',
        store: initialData.store || '',
        description: initialData.description || '',
        paymentMethod: initialData.paymentMethod || settings.defaultPaymentMethod || 'UPI',
        paymentStatus: initialData.paymentStatus || 'Paid',
        receiptImage: initialData.receiptImage || null
      })
    } else if (defaultCategoryId) {
      const match = categories.find(c => c.id === defaultCategoryId)
      if (match) {
        setFormData(prev => ({
          ...prev,
          categoryId: match.id,
          categoryName: match.name
        }))
      }
    }
  }, [initialData, defaultCategoryId, categories, settings])

  const handleCategoryChange = (catId) => {
    const selected = categories.find(c => c.id === catId)
    setFormData(prev => ({
      ...prev,
      categoryId: catId,
      categoryName: selected ? selected.name : ''
    }))
  }

  const handleReceiptUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Convert to base64 for persistent LocalStorage preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, receiptImage: reader.result }))
    }
    reader.readAsDataURL(file)
  }

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
          Expense Title <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Monthly Groceries, Nike Shoes, Fastag"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Expense Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Category & Store */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Store / Shop Name
          </label>
          <input
            type="text"
            placeholder="e.g. Blinkit, Amazon, Shell Petrol"
            value={formData.store}
            onChange={(e) => setFormData(prev => ({ ...prev, store: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Payment Method & Payment Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Payment Method
          </label>
          <PaymentMethodSelect
            value={formData.paymentMethod}
            onChange={(val) => setFormData(prev => ({ ...prev, paymentMethod: val }))}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Payment Status
          </label>
          <select
            value={formData.paymentStatus}
            onChange={(e) => setFormData(prev => ({ ...prev, paymentStatus: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Description / Note
        </label>
        <textarea
          rows={2}
          placeholder="Add any specific item details or context..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Receipt Image Upload */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Receipt Image (Optional)
        </label>
        {formData.receiptImage ? (
          <div className="relative inline-block border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden p-1 bg-slate-50 dark:bg-slate-800">
            <img
              src={formData.receiptImage}
              alt="Receipt Preview"
              className="h-24 w-auto object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, receiptImage: null }))}
              className="absolute top-2 right-2 p-1 rounded-full bg-rose-600 text-white shadow hover:bg-rose-700 transition-colors"
              title="Remove receipt"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-slate-600 dark:text-slate-400 hover:text-indigo-600 cursor-pointer text-xs font-medium transition-colors">
            <Upload className="w-4 h-4 text-slate-400" />
            <span>Upload Receipt / Bill (JPG, PNG)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleReceiptUpload}
              className="hidden"
            />
          </label>
        )}
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
          {initialData ? 'Update Expense' : 'Save Expense'}
        </button>
      </div>
    </form>
  )
}
