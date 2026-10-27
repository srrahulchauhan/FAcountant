import React, { useState, useMemo } from 'react'
import { useFinancial } from '../context/FinancialContext'
import { formatINR } from '../utils/currency'
import { formatDate, isDateToday, isDateInCurrentWeek, isDateInCurrentMonth, isDateInCurrentYear } from '../utils/dateUtils'
import { Modal } from '../components/common/Modal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { SearchBar } from '../components/common/SearchBar'
import { Pagination } from '../components/common/Pagination'
import { StatusBadge } from '../components/common/StatusBadge'
import { PaymentMethodBadge, PAYMENT_METHODS } from '../components/common/PaymentMethodSelect'
import { ReceiptModal } from '../components/common/ReceiptModal'
import { EmptyState } from '../components/common/EmptyState'
import { ExpenseForm } from '../forms/ExpenseForm'
import {
  Plus,
  Receipt,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Filter,
  ArrowUpDown,
  Calendar,
  IndianRupee,
  Store,
  FileText
} from 'lucide-react'

export const Expenses = () => {
  const {
    expenses,
    categories,
    addExpense,
    updateExpense,
    deleteExpense,
    duplicateExpense
  } = useFinancial()

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [viewingExpense, setViewingExpense] = useState(null)
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState(null)

  // Filters & Search & Sort
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedMethod, setSelectedMethod] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [dateFilter, setDateFilter] = useState('All') // 'All' | 'Today' | 'Week' | 'Month' | 'Year'
  const [sortBy, setSortBy] = useState('date-desc') // 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  // Quick Totals
  const totals = useMemo(() => {
    const paid = expenses.filter(e => (e.paymentStatus || 'Paid').toLowerCase() === 'paid')
    return {
      today: paid.filter(e => isDateToday(e.date)).reduce((a, b) => a + Number(b.amount || 0), 0),
      week: paid.filter(e => isDateInCurrentWeek(e.date)).reduce((a, b) => a + Number(b.amount || 0), 0),
      month: paid.filter(e => isDateInCurrentMonth(e.date)).reduce((a, b) => a + Number(b.amount || 0), 0),
      year: paid.filter(e => isDateInCurrentYear(e.date)).reduce((a, b) => a + Number(b.amount || 0), 0),
      all: paid.reduce((a, b) => a + Number(b.amount || 0), 0)
    }
  }, [expenses])

  // Filtered & Sorted Records
  const filteredExpenses = useMemo(() => {
    let result = [...expenses]

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(e =>
        e.title?.toLowerCase().includes(q) ||
        e.store?.toLowerCase().includes(q) ||
        e.categoryName?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q)
      )
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(e => e.categoryName === selectedCategory || e.categoryId === selectedCategory)
    }

    // Payment method filter
    if (selectedMethod !== 'All') {
      result = result.filter(e => e.paymentMethod === selectedMethod)
    }

    // Payment status filter
    if (selectedStatus !== 'All') {
      result = result.filter(e => (e.paymentStatus || 'Paid').toLowerCase() === selectedStatus.toLowerCase())
    }

    // Date filter
    if (dateFilter === 'Today') {
      result = result.filter(e => isDateToday(e.date))
    } else if (dateFilter === 'Week') {
      result = result.filter(e => isDateInCurrentWeek(e.date))
    } else if (dateFilter === 'Month') {
      result = result.filter(e => isDateInCurrentMonth(e.date))
    } else if (dateFilter === 'Year') {
      result = result.filter(e => isDateInCurrentYear(e.date))
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date)
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date)
      if (sortBy === 'amount-desc') return Number(b.amount) - Number(a.amount)
      if (sortBy === 'amount-asc') return Number(a.amount) - Number(b.amount)
      return 0
    })

    return result
  }, [expenses, search, selectedCategory, selectedMethod, selectedStatus, dateFilter, sortBy])

  // Paginated items
  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredExpenses.slice(start, start + pageSize)
  }, [filteredExpenses, currentPage, pageSize])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Daily Expense Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Log, categorize, track receipts, and filter your daily expenditures
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Quick Period Spending Summary Cards (Clickable) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { key: 'Today', label: 'Today', amount: totals.today, color: 'text-slate-900 dark:text-white' },
          { key: 'Week', label: 'This Week', amount: totals.week, color: 'text-slate-900 dark:text-white' },
          { key: 'Month', label: 'This Month', amount: totals.month, color: 'text-indigo-600 dark:text-indigo-400' },
          { key: 'Year', label: 'This Year', amount: totals.year, color: 'text-slate-900 dark:text-white' },
        ].map(item => (
          <div
            key={item.key}
            onClick={() => {
              setDateFilter(dateFilter === item.key ? 'All' : item.key)
              setCurrentPage(1)
            }}
            role="button"
            tabIndex={0}
            className={`p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border shadow-sm cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md active:scale-95 select-none ${
              dateFilter === item.key
                ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-indigo-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className={`text-[11px] font-semibold uppercase tracking-wider ${dateFilter === item.key ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400'}`}>
                {item.label}
              </p>
              {dateFilter === item.key && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              )}
            </div>
            <p className={`mt-1 text-base sm:text-xl font-bold font-heading font-mono ${item.color}`}>
              {formatINR(item.amount)}
            </p>
            <p className="mt-0.5 text-[10px] text-slate-400">
              {dateFilter === item.key ? 'Filter active (click to clear)' : 'Click to filter'}
            </p>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={(val) => { setSearch(val); setCurrentPage(1); }}
              placeholder="Search expenses by title, store, or note..."
            />
          </div>

          {/* Quick Date Presets */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start md:self-auto overflow-x-auto max-w-full">
            {['All', 'Today', 'Week', 'Month', 'Year'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => { setDateFilter(d); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  dateFilter === d
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdowns Row: Category, Payment Method, Status, Sort */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium outline-none text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Payment Method</label>
            <select
              value={selectedMethod}
              onChange={(e) => { setSelectedMethod(e.target.value); setCurrentPage(1); }}
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
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium outline-none text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
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

      {/* Main Expense Table / Card List */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        {filteredExpenses.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No expenses match your criteria"
            description="Try modifying search keywords or resetting filters to view records."
            actionText="Add New Expense"
            onAction={() => setIsAddOpen(true)}
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3 font-medium">Expense</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Store / Merchant</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Method</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Amount</th>
                    <th className="pb-3 font-medium text-center">Receipt</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[200px]">{exp.title}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-slate-600 dark:text-slate-300">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                          {exp.categoryName || 'Other'}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-500 dark:text-slate-400">
                        {exp.store || '-'}
                      </td>
                      <td className="py-3.5 text-slate-500 font-mono">
                        {formatDate(exp.date)}
                      </td>
                      <td className="py-3.5">
                        <PaymentMethodBadge method={exp.paymentMethod} />
                      </td>
                      <td className="py-3.5">
                        <StatusBadge status={exp.paymentStatus || 'Paid'} className="text-[10px]" />
                      </td>
                      <td className="py-3.5 text-right font-extrabold font-mono text-slate-900 dark:text-white text-sm">
                        {formatINR(exp.amount)}
                      </td>
                      <td className="py-3.5 text-center">
                        {exp.receiptImage ? (
                          <button
                            type="button"
                            onClick={() => setPreviewReceiptUrl(exp.receiptImage)}
                            className="p-1 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                            title="View Receipt"
                          >
                            <Receipt className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600 text-[11px]">-</span>
                        )}
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => setViewingExpense(exp)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => duplicateExpense(exp.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Duplicate Expense"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingExpense(exp)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800"
                            title="Edit Expense"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingId(exp.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800"
                            title="Delete Expense"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="lg:hidden space-y-3">
              {paginatedExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {exp.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {exp.categoryName} • {formatDate(exp.date)} {exp.store ? `• ${exp.store}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-900 dark:text-white shrink-0">
                      {formatINR(exp.amount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={exp.paymentStatus || 'Paid'} className="text-[9px]" />
                      <PaymentMethodBadge method={exp.paymentMethod} />
                    </div>

                    <div className="flex items-center gap-1">
                      {exp.receiptImage && (
                        <button
                          type="button"
                          onClick={() => setPreviewReceiptUrl(exp.receiptImage)}
                          className="p-1 rounded text-indigo-600 dark:text-indigo-400"
                          title="Receipt"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => duplicateExpense(exp.id)}
                        className="p-1 rounded text-slate-500 hover:text-slate-700"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingExpense(exp)}
                        className="p-1 rounded text-slate-500 hover:text-indigo-600"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(exp.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredExpenses.length}
              pageSize={pageSize}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Record New Expense"
        subtitle="Fill in amount, category, and payment method"
      >
        <ExpenseForm
          onSubmit={(data) => {
            addExpense(data)
            setIsAddOpen(false)
          }}
          onCancel={() => setIsAddOpen(false)}
        />
      </Modal>

      {/* Edit Expense Modal */}
      <Modal
        isOpen={editingExpense !== null}
        onClose={() => setEditingExpense(null)}
        title="Edit Expense Record"
        subtitle="Modify transaction details and receipt"
      >
        <ExpenseForm
          initialData={editingExpense}
          onSubmit={(data) => {
            updateExpense(editingExpense.id, data)
            setEditingExpense(null)
          }}
          onCancel={() => setEditingExpense(null)}
        />
      </Modal>

      {/* View Expense Details Modal */}
      <Modal
        isOpen={viewingExpense !== null}
        onClose={() => setViewingExpense(null)}
        title="Expense Details"
        subtitle="Full information about this recorded transaction"
      >
        {viewingExpense && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono font-bold">{viewingExpense.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Title:</span>
                <span className="font-bold text-slate-900 dark:text-white">{viewingExpense.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Amount:</span>
                <span className="font-extrabold text-base text-indigo-600 font-mono">{formatINR(viewingExpense.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Date:</span>
                <span className="font-mono">{formatDate(viewingExpense.date)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold">{viewingExpense.categoryName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Store / Merchant:</span>
                <span>{viewingExpense.store || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Payment Method:</span>
                <PaymentMethodBadge method={viewingExpense.paymentMethod} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Payment Status:</span>
                <StatusBadge status={viewingExpense.paymentStatus || 'Paid'} />
              </div>
            </div>

            {viewingExpense.description && (
              <div>
                <h5 className="font-bold text-slate-600 dark:text-slate-400 mb-1">Description:</h5>
                <p className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {viewingExpense.description}
                </p>
              </div>
            )}

            {viewingExpense.receiptImage && (
              <div>
                <h5 className="font-bold text-slate-600 dark:text-slate-400 mb-1">Receipt Attachment:</h5>
                <img
                  src={viewingExpense.receiptImage}
                  alt="Receipt"
                  className="max-h-48 rounded-lg border border-slate-200 dark:border-slate-700 object-contain"
                />
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          deleteExpense(deletingId)
          setDeletingId(null)
        }}
        title="Delete Expense Record"
        message="Are you sure you want to delete this expense? This action will permanently remove it from financial totals."
        confirmText="Yes, Delete"
      />

      {/* Receipt Preview Modal */}
      <ReceiptModal
        isOpen={previewReceiptUrl !== null}
        onClose={() => setPreviewReceiptUrl(null)}
        receiptImage={previewReceiptUrl}
      />
    </div>
  )
}
