import React, { useState } from 'react'
import { useFinancial } from '../context/FinancialContext'
import { formatINR } from '../utils/currency'
import { formatDate } from '../utils/dateUtils'
import { Modal } from '../components/common/Modal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { StatusBadge } from '../components/common/StatusBadge'
import { PaymentMethodBadge } from '../components/common/PaymentMethodSelect'
import { EmptyState } from '../components/common/EmptyState'
import { EMIForm } from '../forms/EMIForm'
import { EMIPaymentForm } from '../forms/EMIPaymentForm'
import {
  CreditCard,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Landmark,
  Edit2,
  Trash2,
  History,
  AlertCircle
} from 'lucide-react'

export const EMIManagement = () => {
  const {
    emiRecords,
    emiPayments,
    addEmiRecord,
    updateEmiRecord,
    deleteEmiRecord,
    recordEmiPayment
  } = useFinancial()

  // Modal States
  const [isAddEmiOpen, setIsAddEmiOpen] = useState(false)
  const [editingEmi, setEditingEmi] = useState(null)
  const [deletingEmiId, setDeletingEmiId] = useState(null)
  const [payEmiId, setPayEmiId] = useState(null)
  const [viewHistoryEmi, setViewHistoryEmi] = useState(null)

  // Calculations across all EMIs
  const totalOriginalAmount = emiRecords.reduce((a, b) => a + Number(b.originalLoanAmount || 0), 0)
  const totalMonthlyCommitment = emiRecords.reduce((a, b) => a + Number(b.monthlyEmiAmount || 0), 0)
  const totalPaidSoFar = emiPayments.reduce((a, b) => a + Number(b.amountPaid || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
            EMI Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track monthly installments, payment schedules, and installment milestones
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPayEmiId(emiRecords[0]?.id || 'custom')}
            disabled={emiRecords.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddEmiOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add EMI</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Financed Amount</p>
          <p className="mt-1 text-2xl font-extrabold font-heading text-slate-900 dark:text-white font-mono">
            {formatINR(totalOriginalAmount)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Across {emiRecords.length} active plans</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Monthly Commitment</p>
          <p className="mt-1 text-2xl font-extrabold font-heading text-indigo-600 dark:text-indigo-400 font-mono">
            {formatINR(totalMonthlyCommitment)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Total monthly installment debit</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Total Repaid via EMI</p>
          <p className="mt-1 text-2xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400 font-mono">
            {formatINR(totalPaidSoFar)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">From {emiPayments.length} recorded payments</p>
        </div>
      </div>

      {/* EMI Cards List */}
      <div className="space-y-4">
        {emiRecords.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No EMI records added yet"
            description="Add your car loan, gadgets, or personal appliance EMIs to track payment progress."
            actionText="Add New EMI"
            onAction={() => setIsAddEmiOpen(true)}
          />
        ) : (
          emiRecords.map((emi) => {
            const total = parseInt(emi.totalInstallments, 10) || 12
            const paid = parseInt(emi.paidInstallments, 10) || 0
            const remaining = Math.max(0, total - paid)
            const progress = ((paid / total) * 100).toFixed(0)

            // Payments linked to this specific EMI
            const linkedPayments = emiPayments.filter(p => p.emiId === emi.id)
            const totalPaidForThis = linkedPayments.reduce((a, b) => a + Number(b.amountPaid || 0), 0)
            const outstandingForThis = Math.max(0, Number(emi.originalLoanAmount || 0) - totalPaidForThis)

            return (
              <div
                key={emi.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg shrink-0">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                          {emi.emiName}
                        </h3>
                        <StatusBadge status={emi.status || 'Pending'} className="text-[10px]" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {emi.bankName} • Interest: {emi.interestRate ? `${emi.interestRate}%` : 'No-Cost (0%)'}
                      </p>
                    </div>
                  </div>

                  {/* Top Right Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setPayEmiId(emi.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Record Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewHistoryEmi(emi)}
                      className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium"
                      title="View Payment History"
                    >
                      <History className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingEmi(emi)}
                      className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit EMI"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingEmiId(emi.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                      title="Delete EMI"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">
                      Installment Progress: {paid} of {total} paid ({progress}%)
                    </span>
                    <span className="font-medium text-slate-500 font-mono">
                      {remaining} remaining
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Number(progress))}%` }}
                    />
                  </div>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Monthly EMI</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                      {formatINR(emi.monthlyEmiAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Original Amount</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                      {formatINR(emi.originalLoanAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Next Due Date</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                      {formatDate(emi.dueDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Method</span>
                    <PaymentMethodBadge method={emi.paymentMethod} className="mt-0.5" />
                  </div>
                </div>

                {emi.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    Note: {emi.notes}
                  </p>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Add EMI Modal */}
      <Modal
        isOpen={isAddEmiOpen}
        onClose={() => setIsAddEmiOpen(false)}
        title="Add EMI Plan"
        subtitle="Record monthly installment details and schedule"
      >
        <EMIForm
          onSubmit={(data) => {
            addEmiRecord(data)
            setIsAddEmiOpen(false)
          }}
          onCancel={() => setIsAddEmiOpen(false)}
        />
      </Modal>

      {/* Edit EMI Modal */}
      <Modal
        isOpen={editingEmi !== null}
        onClose={() => setEditingEmi(null)}
        title="Edit EMI Details"
        subtitle="Modify installment amounts, due dates, or status"
      >
        <EMIForm
          initialData={editingEmi}
          onSubmit={(data) => {
            updateEmiRecord(editingEmi.id, data)
            setEditingEmi(null)
          }}
          onCancel={() => setEditingEmi(null)}
        />
      </Modal>

      {/* Record Payment Modal */}
      <Modal
        isOpen={payEmiId !== null}
        onClose={() => setPayEmiId(null)}
        title="Record EMI Payment"
        subtitle="Record full, partial, or advance payment for this installment"
      >
        <EMIPaymentForm
          defaultEmiId={payEmiId}
          onSubmit={(data) => {
            recordEmiPayment(data)
            setPayEmiId(null)
          }}
          onCancel={() => setPayEmiId(null)}
        />
      </Modal>

      {/* View EMI Payment History Modal */}
      <Modal
        isOpen={viewHistoryEmi !== null}
        onClose={() => setViewHistoryEmi(null)}
        title={`Payment History: ${viewHistoryEmi?.emiName}`}
        subtitle="Recorded payments and installment ledger"
        maxWidth="max-w-2xl"
      >
        {viewHistoryEmi && (
          <div className="space-y-4">
            {emiPayments.filter(p => p.emiId === viewHistoryEmi.id).length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No payments have been recorded for this EMI yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold">
                      <th className="pb-2">Payment Date</th>
                      <th className="pb-2">Installment #</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Reference</th>
                      <th className="pb-2 text-right">Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {emiPayments
                      .filter(p => p.emiId === viewHistoryEmi.id)
                      .map((p) => (
                        <tr key={p.id}>
                          <td className="py-2.5 font-mono">{formatDate(p.paymentDate)}</td>
                          <td className="py-2.5 font-bold">#{p.installmentNumber || '-'}</td>
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
        isOpen={deletingEmiId !== null}
        onClose={() => setDeletingEmiId(null)}
        onConfirm={() => {
          deleteEmiRecord(deletingEmiId)
          setDeletingEmiId(null)
        }}
        title="Delete EMI Record"
        message="Are you sure you want to delete this EMI plan? This will remove the obligation and its schedule from dashboard calculations."
        confirmText="Delete Plan"
      />
    </div>
  )
}
