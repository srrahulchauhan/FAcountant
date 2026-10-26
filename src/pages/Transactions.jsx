import React, { useState, useMemo } from 'react'
import { useFinancial } from '../context/FinancialContext'
import { formatINR } from '../utils/currency'
import { formatDate, isDateInRange } from '../utils/dateUtils'
import { exportTableToExcel } from '../services/exportService'
import { SearchBar } from '../components/common/SearchBar'
import { Pagination } from '../components/common/Pagination'
import { StatusBadge } from '../components/common/StatusBadge'
import { PaymentMethodBadge, PAYMENT_METHODS } from '../components/common/PaymentMethodSelect'
import { Modal } from '../components/common/Modal'
import { EmptyState } from '../components/common/EmptyState'
import {
  ArrowLeftRight,
  Download,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  CreditCard,
  Landmark,
  Home,
  Eye,
  Calendar
} from 'lucide-react'

export const Transactions = () => {
  const {
    income,
    expenses,
    emiPayments,
    loanPayments,
    rentPayments
  } = useFinancial()

  // State
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All') // 'All' | 'Income' | 'Daily Expense' | 'EMI Payment' | 'Loan Repayment' | 'Rent Payment'
  const [methodFilter, setMethodFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sortBy, setSortBy] = useState('date-desc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const [viewingTx, setViewingTx] = useState(null)

  // Consolidate all financial transactions into a single unified stream
  const allTransactions = useMemo(() => {
    const list = []

    income.forEach(inc => {
      list.push({
        id: inc.id,
        sourceRef: `INC-${inc.id.slice(0, 8)}`,
        title: inc.title,
        type: 'Income',
        amount: Number(inc.amount),
        date: inc.date,
        category: inc.source || 'Salary / Payout',
        paymentMethod: inc.paymentMethod || 'Bank Transfer',
        status: 'Received',
        isIncome: true,
        notes: inc.notes || ''
      })
    })

    expenses.forEach(exp => {
      list.push({
        id: exp.id,
        sourceRef: `EXP-${exp.id.slice(0, 8)}`,
        title: exp.title,
        type: 'Daily Expense',
        amount: Number(exp.amount),
        date: exp.date,
        category: exp.categoryName || 'Other',
        store: exp.store || '',
        paymentMethod: exp.paymentMethod || 'UPI',
        status: exp.paymentStatus || 'Paid',
        isIncome: false,
        notes: exp.description || '',
        receiptImage: exp.receiptImage
      })
    })

    emiPayments.forEach(p => {
      list.push({
        id: p.id,
        sourceRef: `EMI-${p.id.slice(0, 8)}`,
        title: `EMI Payment: ${p.emiName}`,
        type: 'EMI Payment',
        amount: Number(p.amountPaid),
        date: p.paymentDate,
        category: 'EMI Obligation',
        paymentMethod: p.paymentMethod || 'Bank Transfer',
        status: 'Paid',
        isIncome: false,
        notes: `${p.paymentType} payment • Installment #${p.installmentNumber || '-'}`,
        transactionRef: p.transactionRef
      })
    })

    loanPayments.forEach(p => {
      list.push({
        id: p.id,
        sourceRef: `LOAN-${p.id.slice(0, 8)}`,
        title: `Loan Repayment: ${p.loanName}`,
        type: 'Loan Repayment',
        amount: Number(p.amountPaid),
        date: p.paymentDate,
        category: 'Loan Account',
        paymentMethod: p.paymentMethod || 'Bank Transfer',
        status: 'Paid',
        isIncome: false,
        notes: `${p.paymentType} repayment`,
        transactionRef: p.transactionRef
      })
    })

    rentPayments.forEach(p => {
      list.push({
        id: p.id,
        sourceRef: `RENT-${p.id.slice(0, 8)}`,
        title: `Rent: ${p.propertyName}`,
        type: 'Rent Payment',
        amount: Number(p.amountPaid),
        date: p.paymentDate,
        category: p.paymentType === 'Security Deposit' ? 'Security Deposit' : 'Rent & PG',
        paymentMethod: p.paymentMethod || 'UPI',
        status: 'Paid',
        isIncome: false,
        notes: `Month: ${p.rentForMonth || '-'}`,
        transactionRef: p.transactionRef
      })
    })

    return list
  }, [income, expenses, emiPayments, loanPayments, rentPayments])

  // Filter & Search & Sort
  const filteredTransactions = useMemo(() => {
    let result = [...allTransactions]

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(tx =>
        tx.title?.toLowerCase().includes(q) ||
        tx.category?.toLowerCase().includes(q) ||
        tx.sourceRef?.toLowerCase().includes(q) ||
        tx.notes?.toLowerCase().includes(q)
      )
    }

    // Type filter
    if (typeFilter !== 'All') {
      result = result.filter(tx => tx.type === typeFilter)
    }

    // Method filter
    if (methodFilter !== 'All') {
      result = result.filter(tx => tx.paymentMethod === methodFilter)
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter(tx => (tx.status || 'Paid').toLowerCase() === statusFilter.toLowerCase())
    }

    // Custom Date Range
    if (startDate || endDate) {
      result = result.filter(tx => isDateInRange(tx.date, startDate, endDate))
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date)
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date)
      if (sortBy === 'amount-desc') return b.amount - a.amount
      if (sortBy === 'amount-asc') return a.amount - b.amount
      return 0
    })

    return result
  }, [allTransactions, search, typeFilter, methodFilter, statusFilter, startDate, endDate, sortBy])

  // Pagination
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredTransactions.slice(start, start + pageSize)
  }, [filteredTransactions, currentPage, pageSize])

  // Export current filtered table
  const handleExportFiltered = () => {
    const dataToExport = filteredTransactions.map(tx => ({
      'Reference ID': tx.sourceRef,
      'Type': tx.type,
      'Title': tx.title,
      'Category': tx.category,
      'Date': formatDate(tx.date),
      'Payment Method': tx.paymentMethod,
      'Status': tx.status,
      'Amount (₹)': tx.amount,
      'Notes': tx.notes || ''
    }))
    exportTableToExcel(dataToExport, 'Filtered_Transactions', 'Transactions')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
            All Transactions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Unified ledger across income, daily expenses, EMI, loan repayments, and rent
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportFiltered}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all self-start sm:self-auto active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Export Excel</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={(val) => { setSearch(val); setCurrentPage(1); }}
              placeholder="Search all transactions by description, reference, or category..."
            />
          </div>

          {/* Date range inputs */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            />
            <span className="text-slate-400 font-medium">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            />
            {(startDate || endDate) && (
              <button
                type="button"
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="text-xs text-rose-500 font-bold hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Dropdowns Row: Type, Method, Status, Sort */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Transaction Type</label>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium outline-none text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Types</option>
              <option value="Income">Income Only</option>
              <option value="Daily Expense">Daily Expenses</option>
              <option value="EMI Payment">EMI Payments</option>
              <option value="Loan Repayment">Loan Repayments</option>
              <option value="Rent Payment">Rent Payments</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Payment Method</label>
            <select
              value={methodFilter}
              onChange={(e) => { setMethodFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium outline-none text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Methods</option>
              {PAYMENT_METHODS.map(pm => (
                <option key={pm.id} value={pm.id}>{pm.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium outline-none text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid / Settled</option>
              <option value="Pending">Pending</option>
              <option value="Received">Received</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium outline-none text-slate-800 dark:text-slate-200"
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="amount-desc">Amount (Highest First)</option>
              <option value="amount-asc">Amount (Lowest First)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        {filteredTransactions.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="No transactions found"
            description="No records match your selected type, date range, or keywords."
          />
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3 font-medium">Ref ID</th>
                    <th className="pb-3 font-medium">Title & Obligation</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Category / Source</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Method</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Amount</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedTransactions.map((tx) => (
                    <tr key={`${tx.type}-${tx.id}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                      <td className="py-3.5 font-mono text-slate-400">
                        {tx.sourceRef}
                      </td>
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[200px]">{tx.title}</span>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.isIncome
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-600 dark:text-slate-300">
                        {tx.category}
                      </td>
                      <td className="py-3.5 text-slate-500 font-mono">
                        {formatDate(tx.date)}
                      </td>
                      <td className="py-3.5">
                        <PaymentMethodBadge method={tx.paymentMethod} />
                      </td>
                      <td className="py-3.5">
                        <StatusBadge status={tx.status} className="text-[10px]" />
                      </td>
                      <td className="py-3.5 text-right font-extrabold font-mono text-sm">
                        <span className={tx.isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}>
                          {tx.isIncome ? '+' : '-'}{formatINR(tx.amount)}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setViewingTx(tx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
              {paginatedTransactions.map((tx) => (
                <div
                  key={`${tx.type}-${tx.id}`}
                  onClick={() => setViewingTx(tx)}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2 cursor-pointer hover:border-indigo-400 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {tx.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {tx.type} • {tx.category} • {formatDate(tx.date)}
                      </p>
                    </div>
                    <span className={`text-xs font-bold font-mono shrink-0 ${
                      tx.isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      {tx.isIncome ? '+' : '-'}{formatINR(tx.amount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={tx.status} className="text-[9px]" />
                      <PaymentMethodBadge method={tx.paymentMethod} />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{tx.sourceRef}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredTransactions.length}
              pageSize={pageSize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}
      </div>

      {/* Transaction Details Modal */}
      <Modal
        isOpen={viewingTx !== null}
        onClose={() => setViewingTx(null)}
        title="Transaction Record Details"
        subtitle="Full information from financial ledger"
      >
        {viewingTx && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Source Reference:</span>
                <span className="font-mono font-bold">{viewingTx.sourceRef}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Transaction Type:</span>
                <span className="font-bold text-indigo-600">{viewingTx.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Title:</span>
                <span className="font-bold text-slate-900 dark:text-white">{viewingTx.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Amount:</span>
                <span className={`font-extrabold text-base font-mono ${viewingTx.isIncome ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                  {viewingTx.isIncome ? '+' : '-'}{formatINR(viewingTx.amount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Date:</span>
                <span className="font-mono">{formatDate(viewingTx.date)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Category / Account:</span>
                <span className="font-semibold">{viewingTx.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Payment Method:</span>
                <PaymentMethodBadge method={viewingTx.paymentMethod} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Status:</span>
                <StatusBadge status={viewingTx.status} />
              </div>
              {viewingTx.transactionRef && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Transaction Ref / UTR:</span>
                  <span className="font-mono font-bold">{viewingTx.transactionRef}</span>
                </div>
              )}
            </div>

            {viewingTx.notes && (
              <div>
                <h5 className="font-bold text-slate-600 dark:text-slate-400 mb-1">Notes:</h5>
                <p className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {viewingTx.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
