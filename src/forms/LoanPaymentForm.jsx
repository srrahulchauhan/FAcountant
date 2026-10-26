import React, { useState, useEffect } from 'react'
import { useFinancial } from '../context/FinancialContext'
import { PaymentMethodSelect } from '../components/common/PaymentMethodSelect'
import { formatInputDate } from '../utils/dateUtils'
import { formatINR } from '../utils/currency'

export const LoanPaymentForm = ({ defaultLoanId = null, onSubmit, onCancel }) => {
  const { loans } = useFinancial()
  const activeLoans = loans.filter(l => (Number(l.outstandingBalance) || 0) > 0 || l.id === defaultLoanId)

  const [formData, setFormData] = useState({
    loanId: defaultLoanId || activeLoans[0]?.id || '',
    paymentType: 'Full',
    amountPaid: '',
    paymentDate: formatInputDate(new Date()),
    transactionRef: '',
    notes: ''
  })

  const selectedLoan = loans.find(l => l.id === formData.loanId)

  useEffect(() => {
    if (selectedLoan) {
      setFormData(prev => ({
        ...prev,
        amountPaid: selectedLoan.monthlyPaymentAmount || selectedLoan.outstandingBalance || ''
      }))
    }
  }, [selectedLoan])

  const handleLoanSelect = (id) => {
    const target = loans.find(l => l.id === id)
    setFormData(prev => ({
      ...prev,
      loanId: id,
      amountPaid: target ? (target.monthlyPaymentAmount || target.outstandingBalance || '') : ''
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.loanId) return
    const amt = Number(formData.amountPaid)
    if (isNaN(amt) || amt <= 0) return

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Select Loan */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Select Loan Account <span className="text-rose-500">*</span>
        </label>
        <select
          value={formData.loanId}
          onChange={(e) => handleLoanSelect(e.target.value)}
          required
          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
        >
          {loans.map(l => (
            <option key={l.id} value={l.id}>
              {l.loanName} ({l.bankName}) - Balance: {formatINR(l.outstandingBalance)}
            </option>
          ))}
        </select>
        {selectedLoan && (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Current Outstanding Balance: <span className="font-bold text-rose-600 dark:text-rose-400">{formatINR(selectedLoan.outstandingBalance)}</span> (Total Repaid: {formatINR(selectedLoan.totalRepaid)})
          </p>
        )}
      </div>

      {/* Payment Type & Amount */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Payment Type
          </label>
          <select
            value={formData.paymentType}
            onChange={(e) => setFormData(prev => ({ ...prev, paymentType: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Full">Regular Monthly Repayment</option>
            <option value="Partial">Partial / Part Payment</option>
            <option value="Advance">Advance / Foreclosure Payment</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Repayment Amount (₹) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
            <input
              type="number"
              step="any"
              min="1"
              required
              value={formData.amountPaid}
              onChange={(e) => setFormData(prev => ({ ...prev, amountPaid: e.target.value }))}
              className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Payment Date & Reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Payment Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            required
            value={formData.paymentDate}
            onChange={(e) => setFormData(prev => ({ ...prev, paymentDate: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Bank / UTR Reference
          </label>
          <input
            type="text"
            placeholder="e.g. UTR / SBIN002938192"
            value={formData.transactionRef}
            onChange={(e) => setFormData(prev => ({ ...prev, transactionRef: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Repayment Notes (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g. Paid via Net Banking, principal prepayment"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
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
          Confirm Loan Repayment
        </button>
      </div>
    </form>
  )
}
