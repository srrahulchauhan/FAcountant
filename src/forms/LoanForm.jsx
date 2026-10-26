import React, { useState, useEffect } from 'react'
import { PaymentMethodSelect } from '../components/common/PaymentMethodSelect'
import { formatInputDate } from '../utils/dateUtils'

export const LoanForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    loanName: '',
    bankName: '',
    loanType: 'Personal Loan',
    originalLoanAmount: '',
    interestRate: '',
    startDate: formatInputDate(new Date()),
    endDate: formatInputDate(new Date()),
    monthlyPaymentAmount: '',
    nextDueDate: formatInputDate(new Date()),
    totalRepaid: 0,
    outstandingBalance: '',
    paymentFrequency: 'Monthly',
    paymentMethod: 'Bank Transfer',
    status: 'Active',
    notes: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        loanName: initialData.loanName || '',
        bankName: initialData.bankName || '',
        loanType: initialData.loanType || 'Personal Loan',
        originalLoanAmount: initialData.originalLoanAmount || '',
        interestRate: initialData.interestRate || '',
        startDate: formatInputDate(initialData.startDate || new Date()),
        endDate: formatInputDate(initialData.endDate || new Date()),
        monthlyPaymentAmount: initialData.monthlyPaymentAmount || '',
        nextDueDate: formatInputDate(initialData.nextDueDate || new Date()),
        totalRepaid: initialData.totalRepaid || 0,
        outstandingBalance: initialData.outstandingBalance !== undefined ? initialData.outstandingBalance : '',
        paymentFrequency: initialData.paymentFrequency || 'Monthly',
        paymentMethod: initialData.paymentMethod || 'Bank Transfer',
        status: initialData.status || 'Active',
        notes: initialData.notes || ''
      })
    }
  }, [initialData])

  // Auto calculate outstanding if original changed and new entry
  const handleOriginalAmountChange = (val) => {
    setFormData(prev => ({
      ...prev,
      originalLoanAmount: val,
      outstandingBalance: !initialData ? val : prev.outstandingBalance
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.loanName.trim()) return
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Loan Name & Bank */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Loan Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. SBI Home Renovation Loan"
            value={formData.loanName}
            onChange={(e) => setFormData(prev => ({ ...prev, loanName: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Bank / Lender / Person <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. State Bank of India, Relative, Friend"
            value={formData.bankName}
            onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Loan Type & Interest Rate */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Loan Type
          </label>
          <select
            value={formData.loanType}
            onChange={(e) => setFormData(prev => ({ ...prev, loanType: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="Personal Loan">Personal Loan</option>
            <option value="Bank Loan">Bank Loan</option>
            <option value="Education Loan">Education Loan</option>
            <option value="Peer/Relative Loan">Peer / Relative Loan</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g. 10.5"
            value={formData.interestRate}
            onChange={(e) => setFormData(prev => ({ ...prev, interestRate: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Original Amount & Outstanding Balance */}
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
              placeholder="e.g. 300000"
              value={formData.originalLoanAmount}
              onChange={(e) => handleOriginalAmountChange(e.target.value)}
              className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Current Outstanding Balance (₹) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
            <input
              type="number"
              step="any"
              min="0"
              required
              placeholder="e.g. 210000"
              value={formData.outstandingBalance}
              onChange={(e) => setFormData(prev => ({ ...prev, outstandingBalance: e.target.value }))}
              className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Monthly Payment & Next Due Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Expected Monthly Repayment (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
            <input
              type="number"
              step="any"
              min="0"
              placeholder="e.g. 10000"
              value={formData.monthlyPaymentAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, monthlyPaymentAmount: e.target.value }))}
              className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Next Payment Due Date
          </label>
          <input
            type="date"
            value={formData.nextDueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, nextDueDate: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Start Date & End Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Disbursement / Start Date
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Expected End Date
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Payment Method
        </label>
        <PaymentMethodSelect
          value={formData.paymentMethod}
          onChange={(val) => setFormData(prev => ({ ...prev, paymentMethod: val }))}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Notes & Agreement Terms
        </label>
        <textarea
          rows={2}
          placeholder="e.g. Personal loan from friend, no foreclosure fee, auto-debit on 5th..."
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
          {initialData ? 'Update Loan' : 'Save Loan Record'}
        </button>
      </div>
    </form>
  )
}
