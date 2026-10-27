import React, { useState } from 'react'
import { useFinancial } from '../context/FinancialContext'
import { formatINR } from '../utils/currency'
import { formatDate } from '../utils/dateUtils'
import { Modal } from '../components/common/Modal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { StatusBadge } from '../components/common/StatusBadge'
import { PaymentMethodBadge } from '../components/common/PaymentMethodSelect'
import { EmptyState } from '../components/common/EmptyState'
import { LoanForm } from '../forms/LoanForm'
import { LoanPaymentForm } from '../forms/LoanPaymentForm'
import {
  Landmark,
  Plus,
  CheckCircle2,
  Calendar,
  History,
  Edit2,
  Trash2,
  Percent,
  TrendingDown
} from 'lucide-react'

export const LoanManagement = () => {
  const {
    loans,
    loanPayments,
    addLoan,
    updateLoan,
    deleteLoan,
    recordLoanPayment
  } = useFinancial()

  // Modal States
  const [isAddLoanOpen, setIsAddLoanOpen] = useState(false)
  const [editingLoan, setEditingLoan] = useState(null)
  const [deletingLoanId, setDeletingLoanId] = useState(null)
  const [payLoanId, setPayLoanId] = useState(null)
  const [viewHistoryLoan, setViewHistoryLoan] = useState(null)

  // Aggregated Loan Metrics
  const totalBorrowed = loans.reduce((a, b) => a + Number(b.originalLoanAmount || 0), 0)
  const totalRepaid = loans.reduce((a, b) => a + Number(b.totalRepaid || 0), 0)
  const totalOutstanding = loans.reduce((a, b) => a + Number(b.outstandingBalance !== undefined ? b.outstandingBalance : (Number(b.originalLoanAmount) - Number(b.totalRepaid))), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Loan Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track personal, bank, and peer borrowing with repayments and balance tracking
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPayLoanId(loans[0]?.id || 'custom')}
            disabled={loans.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Record Repayment</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddLoanOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Loan</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Principal Borrowed</p>
          <p className="mt-1 text-2xl font-extrabold font-heading text-slate-900 dark:text-white font-mono">
            {formatINR(totalBorrowed)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">{loans.length} total loan accounts</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Total Repaid</p>
          <p className="mt-1 text-2xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400 font-mono">
            {formatINR(totalRepaid)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">{totalBorrowed > 0 ? `${((totalRepaid / totalBorrowed) * 100).toFixed(0)}% cleared` : '0% cleared'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider">Total Outstanding Balance</p>
          <p className="mt-1 text-2xl font-extrabold font-heading text-rose-600 dark:text-rose-400 font-mono">
            {formatINR(totalOutstanding)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Current liability to clear</p>
        </div>
      </div>

      {/* Loan Accounts List */}
      <div className="space-y-4">
        {loans.length === 0 ? (
          <EmptyState
            icon={Landmark}
            title="No loan accounts found"
            description="Add personal loans, home renovation loans, or borrowing records to monitor balances."
            actionText="Add New Loan"
            onAction={() => setIsAddLoanOpen(true)}
          />
        ) : (
          loans.map((loan) => {
            const original = Number(loan.originalLoanAmount) || 0
            const repaid = Number(loan.totalRepaid) || 0
            const balance = loan.outstandingBalance !== undefined ? Number(loan.outstandingBalance) : Math.max(0, original - repaid)
            const progress = original > 0 ? ((repaid / original) * 100).toFixed(0) : 0

            return (
              <div
                key={loan.id}
                onClick={() => setViewHistoryLoan(loan)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setViewHistoryLoan(loan)
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all space-y-4 cursor-pointer hover:border-purple-500/40 active:scale-[0.99]"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg shrink-0">
                      <Landmark className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                          {loan.loanName}
                        </h3>
                        <StatusBadge status={loan.status || (balance <= 0 ? 'Closed' : 'Active')} className="text-[10px]" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {loan.bankName} • {loan.loanType || 'Personal Loan'} {loan.interestRate ? `• ${loan.interestRate}% Interest` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-auto" onClick={(e) => e.stopPropagation()}>
                    {balance > 0 && (
                      <button
                        type="button"
                        onClick={() => setPayLoanId(loan.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Repay
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setViewHistoryLoan(loan)}
                      className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium"
                      title="Payment History"
                    >
                      <History className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingLoan(loan)}
                      className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit Loan"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingLoanId(loan.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                      title="Delete Loan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Repayment Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">
                      Repayment Progress: {formatINR(repaid)} repaid ({progress}%)
                    </span>
                    <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">
                      {formatINR(balance)} balance left
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Number(progress))}%` }}
                    />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Original Borrowed</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                      {formatINR(original)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Outstanding Balance</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400 font-mono text-sm">
                      {formatINR(balance)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Next Due Date</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-sm">
                      {loan.nextDueDate ? formatDate(loan.nextDueDate) : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Monthly Repayment</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                      {loan.monthlyPaymentAmount ? formatINR(loan.monthlyPaymentAmount) : '-'}
                    </span>
                  </div>
                </div>

                {loan.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    Note: {loan.notes}
                  </p>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Add Loan Modal */}
      <Modal
        isOpen={isAddLoanOpen}
        onClose={() => setIsAddLoanOpen(false)}
        title="Record New Loan"
        subtitle="Add personal loan, bank borrowing, or peer credit"
      >
        <LoanForm
          onSubmit={(data) => {
            addLoan(data)
            setIsAddLoanOpen(false)
          }}
          onCancel={() => setIsAddLoanOpen(false)}
        />
      </Modal>

      {/* Edit Loan Modal */}
      <Modal
        isOpen={editingLoan !== null}
        onClose={() => setEditingLoan(null)}
        title="Edit Loan Details"
        subtitle="Update balances, monthly repayment target, or due dates"
      >
        <LoanForm
          initialData={editingLoan}
          onSubmit={(data) => {
            updateLoan(editingLoan.id, data)
            setEditingLoan(null)
          }}
          onCancel={() => setEditingLoan(null)}
        />
      </Modal>

      {/* Record Loan Repayment Modal */}
      <Modal
        isOpen={payLoanId !== null}
        onClose={() => setPayLoanId(null)}
        title="Record Loan Repayment"
        subtitle="Enter payment amount to deduct from outstanding balance"
      >
        <LoanPaymentForm
          defaultLoanId={payLoanId}
          onSubmit={(data) => {
            recordLoanPayment(data)
            setPayLoanId(null)
          }}
          onCancel={() => setPayLoanId(null)}
        />
      </Modal>

      {/* View Loan Payment History Modal */}
      <Modal
        isOpen={viewHistoryLoan !== null}
        onClose={() => setViewHistoryLoan(null)}
        title={`Repayment History: ${viewHistoryLoan?.loanName}`}
        subtitle="Ledger of completed payments towards principal/interest"
        maxWidth="max-w-2xl"
      >
        {viewHistoryLoan && (
          <div className="space-y-4">
            {loanPayments.filter(p => p.loanId === viewHistoryLoan.id).length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No repayments have been recorded for this loan yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold">
                      <th className="pb-2">Payment Date</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Transaction Ref</th>
                      <th className="pb-2 text-right">Amount Repaid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {loanPayments
                      .filter(p => p.loanId === viewHistoryLoan.id)
                      .map((p) => (
                        <tr key={p.id}>
                          <td className="py-2.5 font-mono">{formatDate(p.paymentDate)}</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
                              {p.paymentType}
                            </span>
                          </td>
                          <td className="py-2.5 font-mono text-slate-500">{p.transactionRef || '-'}</td>
                          <td className="py-2.5 text-right font-extrabold font-mono text-emerald-600">
                            {formatINR(p.amountPaid)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deletingLoanId !== null}
        onClose={() => setDeletingLoanId(null)}
        onConfirm={() => {
          deleteLoan(deletingLoanId)
          setDeletingLoanId(null)
        }}
        title="Delete Loan Account"
        message="Are you sure you want to delete this loan record? This will remove the liability from total outstanding loan summaries."
        confirmText="Delete Loan"
      />
    </div>
  )
}
