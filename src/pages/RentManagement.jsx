import React, { useState } from 'react'
import { useFinancial } from '../context/FinancialContext'
import { formatINR } from '../utils/currency'
import { formatDate } from '../utils/dateUtils'
import { Modal } from '../components/common/Modal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { StatusBadge } from '../components/common/StatusBadge'
import { PaymentMethodBadge } from '../components/common/PaymentMethodSelect'
import { EmptyState } from '../components/common/EmptyState'
import { RentForm } from '../forms/RentForm'
import { RentPaymentForm } from '../forms/RentPaymentForm'
import {
  Home,
  Plus,
  CheckCircle2,
  Calendar,
  History,
  Edit2,
  Trash2,
  Shield,
  Phone,
  User
} from 'lucide-react'

export const RentManagement = () => {
  const {
    rentRecords,
    rentPayments,
    addRentRecord,
    updateRentRecord,
    deleteRentRecord,
    recordRentPayment
  } = useFinancial()

  // Modal States
  const [isAddRentOpen, setIsAddRentOpen] = useState(false)
  const [editingRent, setEditingRent] = useState(null)
  const [deletingRentId, setDeletingRentId] = useState(null)
  const [payRentId, setPayRentId] = useState(null)
  const [viewHistoryRent, setViewHistoryRent] = useState(null)

  // Totals
  const totalMonthlyRent = rentRecords.reduce((a, b) => a + Number(b.monthlyRent || 0), 0)
  const totalSecurityDeposits = rentRecords.reduce((a, b) => a + Number(b.securityDeposit || 0), 0)
  const totalRentPaidEver = rentPayments
    .filter(p => p.paymentType !== 'Security Deposit')
    .reduce((a, b) => a + Number(b.amountPaid || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Rent & PG Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage apartment leases, monthly rent schedules, and separate security deposits
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPayRentId(rentRecords[0]?.id || 'custom')}
            disabled={rentRecords.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Pay Rent</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddRentOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Monthly Rent</p>
          <p className="mt-1 text-2xl font-extrabold font-heading text-slate-900 dark:text-white font-mono">
            {formatINR(totalMonthlyRent)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">{rentRecords.length} rental properties/PGs</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-cyan-500 uppercase tracking-wider">Security Deposits Held</p>
          <p className="mt-1 text-2xl font-extrabold font-heading text-cyan-600 dark:text-cyan-400 font-mono">
            {formatINR(totalSecurityDeposits)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Tracked separately from expenses</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Total Rent Paid So Far</p>
          <p className="mt-1 text-2xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400 font-mono">
            {formatINR(totalRentPaidEver)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Across {rentPayments.length} monthly receipts</p>
        </div>
      </div>

      {/* Rental Properties List */}
      <div className="space-y-4">
        {rentRecords.length === 0 ? (
          <EmptyState
            icon={Home}
            title="No rental properties listed"
            description="Add your apartment flat, PG room, or studio to organize rent payments and due dates."
            actionText="Add Rental Property"
            onAction={() => setIsAddRentOpen(true)}
          />
        ) : (
          rentRecords.map((rent) => {
            const payments = rentPayments.filter(p => p.rentId === rent.id)
            const lastPayment = payments[0]

            return (
              <div
                key={rent.id}
                onClick={() => setViewHistoryRent(rent)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setViewHistoryRent(rent)
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all space-y-4 cursor-pointer hover:border-cyan-500/40 active:scale-[0.99]"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-lg shrink-0">
                      <Home className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                          {rent.propertyName}
                        </h3>
                        <StatusBadge status={rent.status || 'Pending'} className="text-[10px]" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {rent.roomPgName ? `${rent.roomPgName} • ` : ''}Landlord: {rent.landlordName} {rent.landlordContact ? `(${rent.landlordContact})` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-auto" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setPayRentId(rent.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Pay Rent
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewHistoryRent(rent)}
                      className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium"
                      title="Rent History"
                    >
                      <History className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingRent(rent)}
                      className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingRentId(rent.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                      title="Delete Property"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Monthly Rent</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                      {formatINR(rent.monthlyRent)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Security Deposit</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono text-sm">
                      {formatINR(rent.securityDeposit)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Next Rent Due Date</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                      {rent.nextDueDate ? formatDate(rent.nextDueDate) : `Day ${rent.monthlyDueDay} of month`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Method</span>
                    <PaymentMethodBadge method={rent.paymentMethod} className="mt-0.5" />
                  </div>
                </div>

                {/* Agreement & Notes */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-1">
                  <span>
                    Agreement: {formatDate(rent.agreementStartDate)} to {formatDate(rent.agreementEndDate)}
                  </span>
                  {lastPayment && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      Last Paid: {formatINR(lastPayment.amountPaid)} on {formatDate(lastPayment.paymentDate)} ({lastPayment.rentForMonth || 'Rent'})
                    </span>
                  )}
                </div>

                {rent.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    Note: {rent.notes}
                  </p>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Add Property Modal */}
      <Modal
        isOpen={isAddRentOpen}
        onClose={() => setIsAddRentOpen(false)}
        title="Add Rental Property / PG"
        subtitle="Manage rent agreements, deposits, and monthly due dates"
      >
        <RentForm
          onSubmit={(data) => {
            addRentRecord(data)
            setIsAddRentOpen(false)
          }}
          onCancel={() => setIsAddRentOpen(false)}
        />
      </Modal>

      {/* Edit Property Modal */}
      <Modal
        isOpen={editingRent !== null}
        onClose={() => setEditingRent(null)}
        title="Edit Rental Details"
        subtitle="Update landlord details, rent amount, or due day"
      >
        <RentForm
          initialData={editingRent}
          onSubmit={(data) => {
            updateRentRecord(editingRent.id, data)
            setEditingRent(null)
          }}
          onCancel={() => setEditingRent(null)}
        />
      </Modal>

      {/* Record Rent Payment Modal */}
      <Modal
        isOpen={payRentId !== null}
        onClose={() => setPayRentId(null)}
        title="Record Rent Payment"
        subtitle="Save monthly rent payment and automatically calculate next due date"
      >
        <RentPaymentForm
          defaultRentId={payRentId}
          onSubmit={(data) => {
            recordRentPayment(data)
            setPayRentId(null)
          }}
          onCancel={() => setPayRentId(null)}
        />
      </Modal>

      {/* Rent Payment History Modal */}
      <Modal
        isOpen={viewHistoryRent !== null}
        onClose={() => setViewHistoryRent(null)}
        title={`Rent History: ${viewHistoryRent?.propertyName}`}
        subtitle="Complete receipt ledger and monthly rent payments"
        maxWidth="max-w-2xl"
      >
        {viewHistoryRent && (
          <div className="space-y-4">
            {rentPayments.filter(p => p.rentId === viewHistoryRent.id).length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No rent payments recorded for this property yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold">
                      <th className="pb-2">Payment Date</th>
                      <th className="pb-2">Month For</th>
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Transaction Ref</th>
                      <th className="pb-2 text-right">Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {rentPayments
                      .filter(p => p.rentId === viewHistoryRent.id)
                      .map((p) => (
                        <tr key={p.id}>
                          <td className="py-2.5 font-mono">{formatDate(p.paymentDate)}</td>
                          <td className="py-2.5 font-bold">{p.rentForMonth || '-'}</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 dark:bg-cyan-950 text-cyan-600">
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
        isOpen={deletingRentId !== null}
        onClose={() => setDeletingRentId(null)}
        onConfirm={() => {
          deleteRentRecord(deletingRentId)
          setDeletingRentId(null)
        }}
        title="Remove Rental Property"
        message="Are you sure you want to remove this rental property? This will remove its recurring rent commitment from the dashboard."
        confirmText="Remove Property"
      />
    </div>
  )
}
