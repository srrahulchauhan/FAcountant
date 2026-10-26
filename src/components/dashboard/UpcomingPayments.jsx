import React from 'react'
import { Link } from 'react-router-dom'
import { formatINR } from '../../utils/currency'
import { formatDate } from '../../utils/dateUtils'
import { StatusBadge } from '../common/StatusBadge'
import { Bell, CreditCard, Landmark, Home, ArrowRight, CheckCircle2 } from 'lucide-react'

export const UpcomingPayments = ({
  reminders = [],
  onPayEmi,
  onPayLoan,
  onPayRent
}) => {
  const getIcon = (type) => {
    switch (type) {
      case 'EMI':
        return CreditCard
      case 'Loan':
        return Landmark
      case 'Rent':
        return Home
      default:
        return Bell
    }
  }

  const handlePay = (item) => {
    if (item.type === 'EMI') onPayEmi(item.recordId)
    else if (item.type === 'Loan') onPayLoan(item.recordId)
    else if (item.type === 'Rent') onPayRent(item.recordId)
  }

  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
            Upcoming & Pending Obligations
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Due reminders for EMI, loans, and rental properties
          </p>
        </div>
        <Link
          to="/notifications"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {reminders.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-400 text-xs">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
            No pending or overdue payments! All caught up.
          </div>
        ) : (
          reminders.slice(0, 5).map((item) => {
            const Icon = getIcon(item.type)
            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {item.type} • Due {formatDate(item.dueDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="block text-xs font-bold text-slate-900 dark:text-white font-mono">
                      {formatINR(item.amount)}
                    </span>
                    <StatusBadge status={item.urgency} className="text-[10px]" />
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePay(item)}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
                  >
                    Pay
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
