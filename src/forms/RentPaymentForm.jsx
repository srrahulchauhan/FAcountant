import React, { useState, useEffect } from 'react'
import { useFinancial } from '../context/FinancialContext'
import { PaymentMethodSelect } from '../components/common/PaymentMethodSelect'
import { formatInputDate, formatMonthYear } from '../utils/dateUtils'
import { formatINR } from '../utils/currency'

export const RentPaymentForm = ({ defaultRentId = null, onSubmit, onCancel }) => {
  const { rentRecords } = useFinancial()

  const [formData, setFormData] = useState({
    rentId: defaultRentId || rentRecords[0]?.id || '',
    paymentType: 'Monthly Rent',
    amountPaid: '',
    paymentDate: formatInputDate(new Date()),
    rentForMonth: formatMonthYear(new Date()),
    transactionRef: '',
    notes: ''
  })

  const selectedRent = rentRecords.find(r => r.id === formData.rentId)

  useEffect(() => {
    if (selectedRent) {
      setFormData(prev => ({
        ...prev,
        amountPaid: selectedRent.monthlyRent || ''
      }))
    }
  }, [selectedRent])

  const handleRentSelect = (id) => {
    const target = rentRecords.find(r => r.id === id)
    setFormData(prev => ({
      ...prev,
      rentId: id,
      amountPaid: target ? target.monthlyRent : ''
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.rentId) return
    const amt = Number(formData.amountPaid)
    if (isNaN(amt) || amt <= 0) return

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Select Rent Record */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Select Rental Property <span className="text-rose-500">*</span>
        </label>
        <select
          value={formData.rentId}
          onChange={(e) => handleRentSelect(e.target.value)}
          required
          className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
        >
          {rentRecords.map(r => (
            <option key={r.id} value={r.id}>
              {r.propertyName} ({r.roomPgName || r.landlordName}) - {formatINR(r.monthlyRent)}/mo
            </option>
          ))}
        </select>
        {selectedRent && (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Next Scheduled Due Date: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedRent.nextDueDate}</span>
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
            <option value="Monthly Rent">Monthly Rent</option>
            <option value="Advance Rent">Advance Rent Payment</option>
            <option value="Partial">Partial Rent Payment</option>
            <option value="Security Deposit">Security Deposit Payment</option>
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

      {/* Payment Date & Rent For Month */}
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
            Rent For Month
          </label>
          <input
            type="text"
            placeholder="e.g. October 2026"
            value={formData.rentForMonth}
            onChange={(e) => setFormData(prev => ({ ...prev, rentForMonth: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Transaction Reference */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          UPI / Bank Transaction Reference
        </label>
        <input
          type="text"
          placeholder="e.g. UPI Ref / GPay Transaction ID"
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
          placeholder="e.g. Sent directly to landlord Google Pay"
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
          Confirm Rent Payment
        </button>
      </div>
    </form>
  )
}
