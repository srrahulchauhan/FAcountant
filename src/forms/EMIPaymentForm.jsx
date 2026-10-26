import React, { useState, useEffect } from 'react'
import { useFinancial } from '../context/FinancialContext'
import { PaymentMethodSelect } from '../components/common/PaymentMethodSelect'
import { formatInputDate } from '../utils/dateUtils'
import { formatINR } from '../utils/currency'

export const EMIPaymentForm = ({ defaultEmiId = null, onSubmit, onCancel }) => {
  const { emiRecords } = useFinancial()

  const [formData, setFormData] = useState({
    emiId: defaultEmiId || emiRecords[0]?.id || '',
    paymentType: 'Full',
    amountPaid: '',
    paymentDate: formatInputDate(new Date()),
    transactionRef: '',
    installmentNumber: '',
    notes: ''
  })

  const selectedEmi = emiRecords.find(e => e.id === formData.emiId)

  useEffect(() => {
    if (selectedEmi) {
      setFormData(prev => ({
        ...prev,
        amountPaid: selectedEmi.monthlyEmiAmount || '',
        installmentNumber: (parseInt(selectedEmi.paidInstallments, 10) || 0) + 1
      }))
    }
  }, [selectedEmi])

  const handleEmiSelect = (id) => {
    const target = emiRecords.find(e => e.id === id)
    setFormData(prev => ({
      ...prev,
      emiId: id,
      amountPaid: target ? target.monthlyEmiAmount : '',
      installmentNumber: target ? (parseInt(target.paidInstallments, 10) || 0) + 1 : ''
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.emiId) return
    const amt = Number(formData.amountPaid)
    if (isNaN(amt) || amt <= 0) return

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Select EMI */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Select EMI Obligation <span className="text-rose-500">*</span>
        </label>
        <select
          value={formData.emiId}
          onChange={(e) => handleEmiSelect(e.target.value)}
          required
          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
        >
          {emiRecords.map(e => (
            <option key={e.id} value={e.id}>
              {e.emiName} ({e.bankName}) - {formatINR(e.monthlyEmiAmount)}/mo
            </option>
          ))}
        </select>
        {selectedEmi && (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Progress: {selectedEmi.paidInstallments} of {selectedEmi.totalInstallments} installments paid ({((selectedEmi.paidInstallments / selectedEmi.totalInstallments) * 100).toFixed(0)}%)
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
            <option value="Full">Full Monthly Installment</option>
            <option value="Partial">Partial Payment</option>
            <option value="Advance">Advance Payment</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Amount Paid (₹) <span className="text-rose-500">*</span>
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

      {/* Payment Date & Installment Number */}
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
            Installment Number
          </label>
          <input
            type="number"
            min="1"
            placeholder="e.g. 13"
            value={formData.installmentNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, installmentNumber: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Transaction Reference */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Bank / UPI Transaction Reference (UTR)
        </label>
        <input
          type="text"
          placeholder="e.g. UTR / Ref No. 9482910482"
          value={formData.transactionRef}
          onChange={(e) => setFormData(prev => ({ ...prev, transactionRef: e.target.value }))}
          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Payment Notes (Optional)
        </label>
        <input
          type="text"
          placeholder="e.g. Deducted via auto-debit from salary account"
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
          Confirm Payment Record
        </button>
      </div>
    </form>
  )
}
