import React, { useState, useEffect } from 'react'
import { PaymentMethodSelect } from '../components/common/PaymentMethodSelect'
import { formatInputDate } from '../utils/dateUtils'

export const EMIForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    emiName: '',
    bankName: '',
    originalLoanAmount: '',
    monthlyEmiAmount: '',
    interestRate: '',
    startDate: formatInputDate(new Date()),
    dueDate: formatInputDate(new Date()),
    totalInstallments: 36,
    paidInstallments: 0,
    paymentFrequency: 'Monthly',
    paymentMethod: 'Bank Transfer',
    status: 'Pending',
    notes: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        emiName: initialData.emiName || '',
        bankName: initialData.bankName || '',
        originalLoanAmount: initialData.originalLoanAmount || '',
        monthlyEmiAmount: initialData.monthlyEmiAmount || '',
        interestRate: initialData.interestRate || '',
        startDate: formatInputDate(initialData.startDate || new Date()),
        dueDate: formatInputDate(initialData.dueDate || new Date()),
        totalInstallments: initialData.totalInstallments || 12,
        paidInstallments: initialData.paidInstallments || 0,
        paymentFrequency: initialData.paymentFrequency || 'Monthly',
        paymentMethod: initialData.paymentMethod || 'Bank Transfer',
        status: initialData.status || 'Pending',
        notes: initialData.notes || ''
      })
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.emiName.trim()) return
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* EMI Name & Bank */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            EMI / Obligation Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Car Loan, iPhone EMI, Home Loan"
            value={formData.emiName}
            onChange={(e) => setFormData(prev => ({ ...prev, emiName: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Bank or Lender Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. HDFC Bank, SBI, Bajaj Finserv"
            value={formData.bankName}
            onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Original Amount & Monthly EMI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Original Loan Amount (₹) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
            <input
              type="number"
              step="any"
              min="1"
              required
              placeholder="e.g. 500000"
              value={formData.originalLoanAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, originalLoanAmount: e.target.value }))}
              className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Monthly EMI Amount (₹) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
            <input
              type="number"
              step="any"
              min="1"
              required
              placeholder="e.g. 14500"
              value={formData.monthlyEmiAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, monthlyEmiAmount: e.target.value }))}
              className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Interest Rate & Installments */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g. 9.5"
            value={formData.interestRate}
            onChange={(e) => setFormData(prev => ({ ...prev, interestRate: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Total Installments <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            required
            value={formData.totalInstallments}
            onChange={(e) => setFormData(prev => ({ ...prev, totalInstallments: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Paid Installments
          </label>
          <input
            type="number"
            min="0"
            value={formData.paidInstallments}
            onChange={(e) => setFormData(prev => ({ ...prev, paidInstallments: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Start Date & Next Due Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Start Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            required
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Next Due Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            required
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Payment Method / Debit Source
        </label>
        <PaymentMethodSelect
          value={formData.paymentMethod}
          onChange={(val) => setFormData(prev => ({ ...prev, paymentMethod: val }))}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Notes / Account Details
        </label>
        <textarea
          rows={2}
          placeholder="e.g. Loan account number, auto-debit bank, foreclosure terms..."
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
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
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all active:scale-95"
        >
          {initialData ? 'Update EMI' : 'Save EMI Record'}
        </button>
      </div>
    </form>
  )
}
