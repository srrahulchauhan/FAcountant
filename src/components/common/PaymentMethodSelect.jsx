import React from 'react'
import {
  CreditCard,
  Smartphone,
  Wallet,
  Landmark,
  Coins,
  QrCode,
  DollarSign
} from 'lucide-react'

export const PAYMENT_METHODS = [
  { id: 'UPI', label: 'UPI / QR', icon: QrCode },
  { id: 'Google Pay', label: 'Google Pay', icon: Smartphone },
  { id: 'PhonePe', label: 'PhonePe', icon: Smartphone },
  { id: 'Paytm', label: 'Paytm', icon: Wallet },
  { id: 'Cash', label: 'Cash', icon: Coins },
  { id: 'Bank Transfer', label: 'Bank Transfer / NEFT', icon: Landmark },
  { id: 'Debit Card', label: 'Debit Card', icon: CreditCard },
  { id: 'Credit Card', label: 'Credit Card', icon: CreditCard },
  { id: 'Other', label: 'Other', icon: DollarSign }
]

export const PaymentMethodBadge = ({ method = 'UPI', className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 ${className}`}>
      {method}
    </span>
  )
}

export const PaymentMethodSelect = ({
  value = 'UPI',
  onChange,
  className = '',
  id = 'payment-method-select',
  required = false
}) => {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${className}`}
    >
      {PAYMENT_METHODS.map((pm) => (
        <option key={pm.id} value={pm.id}>
          {pm.label}
        </option>
      ))}
    </select>
  )
}
