import React from 'react'
import { Link } from 'react-router-dom'
import { formatINR } from '../../utils/currency'
import { formatDate } from '../../utils/dateUtils'
import { StatusBadge } from '../common/StatusBadge'
import { PaymentMethodBadge } from '../common/PaymentMethodSelect'
import { ArrowRight, ArrowDownLeft, ArrowUpRight, Receipt, CreditCard } from 'lucide-react'

export const RecentTransactions = ({
  expenses = [],
  income = [],
  emiPayments = [],
  loanPayments = [],
  rentPayments = []
}) => {
  // Combine into unified recent items
  const allRecent = [
    ...income.map(i => ({
      id: i.id,
      title: i.title,
      type: 'Income',
      amount: i.amount,
      date: i.date,
      category: i.source || 'Salary / Income',
      paymentMethod: i.paymentMethod,
      status: 'Received',
      isIncome: true
    })),
    ...expenses.map(e => ({
      id: e.id,
      title: e.title,
      type: 'Expense',
      amount: e.amount,
      date: e.date,
      category: e.categoryName,
      paymentMethod: e.paymentMethod,
      status: e.paymentStatus || 'Paid',
      isIncome: false
    })),
    ...emiPayments.map(p => ({
      id: p.id,
      title: `EMI: ${p.emiName}`,
      type: 'EMI',
      amount: p.amountPaid,
      date: p.paymentDate,
      category: 'EMI Installment',
      paymentMethod: p.paymentMethod || 'Bank Transfer',
      status: 'Paid',
      isIncome: false
    })),
    ...loanPayments.map(p => ({
      id: p.id,
      title: `Loan: ${p.loanName}`,
      type: 'Loan',
      amount: p.amountPaid,
      date: p.paymentDate,
      category: 'Loan Repayment',
      paymentMethod: p.paymentMethod || 'Bank Transfer',
      status: 'Paid',
      isIncome: false
    })),
    ...rentPayments.map(p => ({
      id: p.id,
      title: `Rent: ${p.propertyName}`,
      type: 'Rent',
      amount: p.amountPaid,
      date: p.paymentDate,
      category: 'Rent Payment',
      paymentMethod: p.paymentMethod || 'UPI',
      status: 'Paid',
      isIncome: false
    }))
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)

  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
            Recent Transactions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Latest income, daily expenses, and repayments
          </p>
        </div>
        <Link
          to="/transactions"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {allRecent.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs">
          No transactions recorded yet.
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 font-medium">Transaction</th>
                  <th className="pb-3 font-medium">Category / Type</th>
                  <th className="pb-3 font-medium">Method</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {allRecent.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        item.isIncome ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {item.isIncome ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <Receipt className="w-3.5 h-3.5" />}
                      </div>
                      <span className="truncate max-w-[180px]">{item.title}</span>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {item.category}
                    </td>
                    <td className="py-3">
                      <PaymentMethodBadge method={item.paymentMethod} />
                    </td>
                    <td className="py-3 text-slate-500 font-mono">
                      {formatDate(item.date)}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={item.status} className="text-[10px]" />
                    </td>
                    <td className="py-3 text-right font-bold font-mono">
                      <span className={item.isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}>
                        {item.isIncome ? '+' : '-'}{formatINR(item.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-2.5">
            {allRecent.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    item.isIncome ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {item.isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.category} • {formatDate(item.date)}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`block text-xs font-bold font-mono ${
                    item.isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                  }`}>
                    {item.isIncome ? '+' : '-'}{formatINR(item.amount)}
                  </span>
                  <StatusBadge status={item.status} className="text-[9px] mt-0.5" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
