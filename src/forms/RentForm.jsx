import React, { useState, useEffect } from 'react'
import { PaymentMethodSelect } from '../components/common/PaymentMethodSelect'
import { formatInputDate } from '../utils/dateUtils'

export const RentForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    propertyName: '',
    roomPgName: '',
    landlordName: '',
    landlordContact: '',
    monthlyRent: '',
    securityDeposit: '',
    agreementStartDate: formatInputDate(new Date()),
    agreementEndDate: formatInputDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
    monthlyDueDay: 5,
    nextDueDate: formatInputDate(new Date()),
    paymentMethod: 'UPI',
    status: 'Pending',
    notes: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        propertyName: initialData.propertyName || '',
        roomPgName: initialData.roomPgName || '',
        landlordName: initialData.landlordName || '',
        landlordContact: initialData.landlordContact || '',
        monthlyRent: initialData.monthlyRent || '',
        securityDeposit: initialData.securityDeposit || '',
        agreementStartDate: formatInputDate(initialData.agreementStartDate || new Date()),
        agreementEndDate: formatInputDate(initialData.agreementEndDate || new Date()),
        monthlyDueDay: initialData.monthlyDueDay || 5,
        nextDueDate: formatInputDate(initialData.nextDueDate || new Date()),
        paymentMethod: initialData.paymentMethod || 'UPI',
        status: initialData.status || 'Pending',
        notes: initialData.notes || ''
      })
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.propertyName.trim()) return
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Property Name & PG/Room */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Property / Apartment Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Palm Grove Apt, Indiranagar Flat"
            value={formData.propertyName}
            onChange={(e) => setFormData(prev => ({ ...prev, propertyName: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Room / Flat / PG Unit No.
          </label>
          <input
            type="text"
            placeholder="e.g. Flat 302, Room 4B"
            value={formData.roomPgName}
            onChange={(e) => setFormData(prev => ({ ...prev, roomPgName: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Landlord Name & Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Landlord / Owner Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Mr. Rajesh Verma"
            value={formData.landlordName}
            onChange={(e) => setFormData(prev => ({ ...prev, landlordName: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Landlord Contact / Phone
          </label>
          <input
            type="text"
            placeholder="e.g. +91 98765 43210"
            value={formData.landlordContact}
            onChange={(e) => setFormData(prev => ({ ...prev, landlordContact: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Monthly Rent & Security Deposit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Monthly Rent (₹) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
            <input
              type="number"
              step="any"
              min="1"
              required
              placeholder="e.g. 25000"
              value={formData.monthlyRent}
              onChange={(e) => setFormData(prev => ({ ...prev, monthlyRent: e.target.value }))}
              className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Security Deposit (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
            <input
              type="number"
              step="any"
              min="0"
              placeholder="e.g. 100000"
              value={formData.securityDeposit}
              onChange={(e) => setFormData(prev => ({ ...prev, securityDeposit: e.target.value }))}
              className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            *Security deposits are tracked separately and not counted as monthly rent expense.
          </p>
        </div>
      </div>

      {/* Due Day & Next Due Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Monthly Due Day (Day of Month)
          </label>
          <input
            type="number"
            min="1"
            max="31"
            placeholder="e.g. 5"
            value={formData.monthlyDueDay}
            onChange={(e) => setFormData(prev => ({ ...prev, monthlyDueDay: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Next Payment Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            required
            value={formData.nextDueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, nextDueDate: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Agreement Start & End */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Agreement Start Date
          </label>
          <input
            type="date"
            value={formData.agreementStartDate}
            onChange={(e) => setFormData(prev => ({ ...prev, agreementStartDate: e.target.value }))}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Agreement End Date
          </label>
          <input
            type="date"
            value={formData.agreementEndDate}
            onChange={(e) => setFormData(prev => ({ ...prev, agreementEndDate: e.target.value }))}
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
          Notes / Maintenance details
        </label>
        <textarea
          rows={2}
          placeholder="e.g. Maintenance included, separate water bill, electricity meter number..."
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
          {initialData ? 'Update Property' : 'Save Property'}
        </button>
      </div>
    </form>
  )
}
