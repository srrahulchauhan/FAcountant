import React, { useState, useMemo } from 'react'
import { useFinancial } from '../context/FinancialContext'
import { formatINR } from '../utils/currency'
import { formatDate, isDateInRange } from '../utils/dateUtils'
import { exportFullExcelWorkbook, exportTableToExcel } from '../services/exportService'
import { StatusBadge } from '../components/common/StatusBadge'
import { PaymentMethodBadge } from '../components/common/PaymentMethodSelect'
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  Receipt,
  CreditCard,
  Landmark,
  Home,
  CheckCircle2
} from 'lucide-react'

const REPORT_TYPES = [
  { id: 'consolidated', label: 'Consolidated Financial Summary' },
  { id: 'income-vs-expense', label: 'Income vs Expenses Statement' },
  { id: 'daily-expenses', label: 'Daily Expense Statement' },
  { id: 'weekly-expenses', label: 'Weekly Expense Statement' },
  { id: 'monthly-expenses', label: 'Monthly Expense Statement' },
  { id: 'yearly-expenses', label: 'Yearly Expense Statement' },
  { id: 'category-wise', label: 'Category-Wise Expense Report' },
  { id: 'emi-statement', label: 'EMI Payment Statement' },
  { id: 'loan-statement', label: 'Loan Repayment Statement' },
  { id: 'rent-statement', label: 'Rent Payment Statement' },
  { id: 'payment-method', label: 'Payment Method Breakdown' },
  { id: 'pending-payments', label: 'Pending Payment Report' },
  { id: 'overdue-payments', label: 'Overdue Payment Report' },
  { id: 'advance-payments', label: 'Advance Payment Report' },
]

export const Reports = () => {
  const {
    income,
    expenses,
    categories,
    emiRecords,
    emiPayments,
    loans,
    loanPayments,
    rentRecords,
    rentPayments,
    budgets,
    settings,
    financialSummary
  } = useFinancial()

  const [selectedReport, setSelectedReport] = useState('consolidated')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Filter records by custom date range if applied
  const filterByDate = (dateVal) => {
    if (!startDate && !endDate) return true
    return isDateInRange(dateVal, startDate, endDate)
  }

  // Filtered collections
  const filteredIncome = useMemo(() => income.filter(i => filterByDate(i.date)), [income, startDate, endDate])
  const filteredExpenses = useMemo(() => expenses.filter(e => filterByDate(e.date)), [expenses, startDate, endDate])
  const filteredEmiPay = useMemo(() => emiPayments.filter(p => filterByDate(p.paymentDate)), [emiPayments, startDate, endDate])
  const filteredLoanPay = useMemo(() => loanPayments.filter(p => filterByDate(p.paymentDate)), [loanPayments, startDate, endDate])
  const filteredRentPay = useMemo(() => rentPayments.filter(p => filterByDate(p.paymentDate)), [rentPayments, startDate, endDate])

  // Active Report Metrics
  const activeReportData = useMemo(() => {
    switch (selectedReport) {
      case 'consolidated': {
        const totalInc = filteredIncome.reduce((a, b) => a + Number(b.amount || 0), 0)
        const totalExp = filteredExpenses.filter(e => (e.paymentStatus || 'Paid').toLowerCase() === 'paid').reduce((a, b) => a + Number(b.amount || 0), 0)
        const totalEmi = filteredEmiPay.reduce((a, b) => a + Number(b.amountPaid || 0), 0)
        const totalLoan = filteredLoanPay.reduce((a, b) => a + Number(b.amountPaid || 0), 0)
        const totalRent = filteredRentPay.filter(p => p.paymentType !== 'Security Deposit').reduce((a, b) => a + Number(b.amountPaid || 0), 0)
        const totalOutflow = totalExp + totalEmi + totalLoan + totalRent
        const netSavings = totalInc - totalOutflow

        return {
          totalInc,
          totalExp,
          totalEmi,
          totalLoan,
          totalRent,
          totalOutflow,
          netSavings
        }
      }

      case 'category-wise': {
        const catMap = {}
        filteredExpenses.forEach(e => {
          const cat = e.categoryName || 'Other'
          catMap[cat] = (catMap[cat] || 0) + Number(e.amount || 0)
        })
        const total = Object.values(catMap).reduce((a, b) => a + b, 0)
        return Object.entries(catMap).map(([name, amount]) => ({
          name,
          amount,
          percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : 0
        })).sort((a, b) => b.amount - a.amount)
      }

      case 'payment-method': {
        const methodMap = {}
        const addMethod = (method, amount) => {
          const m = method || 'Other'
          methodMap[m] = (methodMap[m] || 0) + Number(amount || 0)
        }
        filteredExpenses.forEach(e => addMethod(e.paymentMethod, e.amount))
        filteredEmiPay.forEach(e => addMethod(e.paymentMethod || 'Bank Transfer', e.amountPaid))
        filteredLoanPay.forEach(e => addMethod(e.paymentMethod || 'Bank Transfer', e.amountPaid))
        filteredRentPay.forEach(e => addMethod(e.paymentMethod || 'UPI', e.amountPaid))

        const total = Object.values(methodMap).reduce((a, b) => a + b, 0)
        return Object.entries(methodMap).map(([name, amount]) => ({
          name,
          amount,
          percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : 0
        })).sort((a, b) => b.amount - a.amount)
      }

      default:
        return {}
    }
  }, [selectedReport, filteredIncome, filteredExpenses, filteredEmiPay, filteredLoanPay, filteredRentPay])

  // Print Handler
  const handlePrint = () => {
    window.print()
  }

  // Export 12-worksheet Consolidated Excel
  const handleExportFullExcel = () => {
    exportFullExcelWorkbook({
      income,
      expenses,
      categories,
      emiRecords,
      emiPayments,
      loans,
      loanPayments,
      rentRecords,
      rentPayments,
      budgets,
      settings
    })
  }

  return (
    <div className="space-y-6">
      {/* Top Header - Hidden on print */}
      <div className="no-print flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Statements & Financial Reports
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate 13 comprehensive reports, statements, and 12-sheet Excel exports
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={handleExportFullExcel}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download 12-Sheet Excel</span>
          </button>
        </div>
      </div>

      {/* Report Selector & Date Filter Controls - Hidden on print */}
      <div className="no-print p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Select Statement / Report</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {REPORT_TYPES.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
              />
            </div>
            {(startDate || endDate) && (
              <button
                type="button"
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="mt-4 text-xs text-rose-500 font-bold hover:underline"
              >
                Clear Dates
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div className="print-page p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Printable Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm">₹</span>
              <h1 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                FinTrack Financial Statement
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {REPORT_TYPES.find(r => r.id === selectedReport)?.label}
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 font-mono">
            <p>Generated: {new Date().toLocaleString()}</p>
            <p>User: {settings.profile?.name || 'Aakash Sharma'}</p>
            {(startDate || endDate) && (
              <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                Range: {startDate ? formatDate(startDate) : 'Start'} to {endDate ? formatDate(endDate) : 'End'}
              </p>
            )}
          </div>
        </div>

        {/* 1. CONSOLIDATED FINANCIAL SUMMARY */}
        {selectedReport === 'consolidated' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Inflow</span>
                <p className="mt-1 text-lg font-bold font-mono text-emerald-600">{formatINR(activeReportData.totalInc)}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Outflow</span>
                <p className="mt-1 text-lg font-bold font-mono text-rose-600">{formatINR(activeReportData.totalOutflow)}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold uppercase text-slate-400">Net Balance</span>
                <p className="mt-1 text-lg font-bold font-mono text-indigo-600">{formatINR(activeReportData.netSavings)}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold uppercase text-slate-400">Savings Rate</span>
                <p className="mt-1 text-lg font-bold font-mono text-slate-800 dark:text-slate-200">
                  {activeReportData.totalInc > 0 ? `${((activeReportData.netSavings / activeReportData.totalInc) * 100).toFixed(1)}%` : '0%'}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-3">Financial Category</th>
                    <th className="pb-3">Record Count</th>
                    <th className="pb-3 text-right">Total Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  <tr>
                    <td className="py-3 font-semibold text-emerald-600">Total Income Credited</td>
                    <td className="py-3 font-mono">{filteredIncome.length} entries</td>
                    <td className="py-3 text-right font-extrabold font-mono text-emerald-600">+{formatINR(activeReportData.totalInc)}</td>
                  </tr>
                  <tr>
                    <td className="py-3">Regular Daily Expenses</td>
                    <td className="py-3 font-mono">{filteredExpenses.length} receipts</td>
                    <td className="py-3 text-right font-bold font-mono text-slate-900 dark:text-white">-{formatINR(activeReportData.totalExp)}</td>
                  </tr>
                  <tr>
                    <td className="py-3">EMI Payments Recorded</td>
                    <td className="py-3 font-mono">{filteredEmiPay.length} payments</td>
                    <td className="py-3 text-right font-bold font-mono text-slate-900 dark:text-white">-{formatINR(activeReportData.totalEmi)}</td>
                  </tr>
                  <tr>
                    <td className="py-3">Loan Repayments Recorded</td>
                    <td className="py-3 font-mono">{filteredLoanPay.length} payments</td>
                    <td className="py-3 text-right font-bold font-mono text-slate-900 dark:text-white">-{formatINR(activeReportData.totalLoan)}</td>
                  </tr>
                  <tr>
                    <td className="py-3">Rent Payments Recorded</td>
                    <td className="py-3 font-mono">{filteredRentPay.length} payments</td>
                    <td className="py-3 text-right font-bold font-mono text-slate-900 dark:text-white">-{formatINR(activeReportData.totalRent)}</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 font-bold">
                    <td className="py-3.5 text-indigo-600 font-bold">Net Consolidated Surplus / Savings</td>
                    <td className="py-3.5 font-mono">-</td>
                    <td className="py-3.5 text-right font-black font-mono text-indigo-600 text-sm">{formatINR(activeReportData.netSavings)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. CATEGORY-WISE REPORT */}
        {selectedReport === 'category-wise' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-3">Category Name</th>
                    <th className="pb-3">Share Percentage</th>
                    <th className="pb-3 text-right">Total Spent (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {Array.isArray(activeReportData) && activeReportData.map(item => (
                    <tr key={item.name}>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">{item.name}</td>
                      <td className="py-3 font-mono">{item.percentage}%</td>
                      <td className="py-3 text-right font-extrabold font-mono text-slate-900 dark:text-white">{formatINR(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. PAYMENT METHOD REPORT */}
        {selectedReport === 'payment-method' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-3">Payment Channel</th>
                    <th className="pb-3">Transaction Share</th>
                    <th className="pb-3 text-right">Volume Processed (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {Array.isArray(activeReportData) && activeReportData.map(item => (
                    <tr key={item.name}>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">{item.name}</td>
                      <td className="py-3 font-mono">{item.percentage}%</td>
                      <td className="py-3 text-right font-extrabold font-mono text-slate-900 dark:text-white">{formatINR(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. EXPENSE / EMI / LOAN / RENT / PENDING TABLES FOR OTHER REPORTS */}
        {(selectedReport.includes('expense') || selectedReport.includes('income')) && selectedReport !== 'category-wise' && selectedReport !== 'consolidated' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Payment Method</th>
                    <th className="pb-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredExpenses.slice(0, 20).map(e => (
                    <tr key={e.id}>
                      <td className="py-2.5 font-mono">{formatDate(e.date)}</td>
                      <td className="py-2.5 font-bold text-slate-900 dark:text-white">{e.title}</td>
                      <td className="py-2.5">{e.categoryName}</td>
                      <td className="py-2.5">{e.paymentMethod}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-slate-900 dark:text-white">{formatINR(e.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === 'emi-statement' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-3">Payment Date</th>
                    <th className="pb-3">EMI Obligation</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Transaction Ref</th>
                    <th className="pb-3 text-right">Amount Paid (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredEmiPay.map(p => (
                    <tr key={p.id}>
                      <td className="py-2.5 font-mono">{formatDate(p.paymentDate)}</td>
                      <td className="py-2.5 font-bold text-slate-900 dark:text-white">{p.emiName}</td>
                      <td className="py-2.5">{p.paymentType}</td>
                      <td className="py-2.5 font-mono text-slate-500">{p.transactionRef || '-'}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-emerald-600">{formatINR(p.amountPaid)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === 'loan-statement' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Loan Account</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Reference</th>
                    <th className="pb-3 text-right">Amount Repaid (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredLoanPay.map(p => (
                    <tr key={p.id}>
                      <td className="py-2.5 font-mono">{formatDate(p.paymentDate)}</td>
                      <td className="py-2.5 font-bold text-slate-900 dark:text-white">{p.loanName}</td>
                      <td className="py-2.5">{p.paymentType}</td>
                      <td className="py-2.5 font-mono text-slate-500">{p.transactionRef || '-'}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-emerald-600">{formatINR(p.amountPaid)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReport === 'rent-statement' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Property</th>
                    <th className="pb-3">Month For</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3 text-right">Amount Paid (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredRentPay.map(p => (
                    <tr key={p.id}>
                      <td className="py-2.5 font-mono">{formatDate(p.paymentDate)}</td>
                      <td className="py-2.5 font-bold text-slate-900 dark:text-white">{p.propertyName}</td>
                      <td className="py-2.5 font-medium">{p.rentForMonth || '-'}</td>
                      <td className="py-2.5">{p.paymentType}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-emerald-600">{formatINR(p.amountPaid)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(selectedReport === 'pending-payments' || selectedReport === 'overdue-payments') && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-3">Due Date</th>
                    <th className="pb-3">Obligation</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Urgency Status</th>
                    <th className="pb-3 text-right">Amount Due (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {financialSummary.reminders
                    .filter(r => selectedReport === 'overdue-payments' ? r.urgency === 'overdue' : r.urgency !== 'overdue')
                    .map(r => (
                      <tr key={r.id}>
                        <td className="py-2.5 font-mono text-rose-600 font-bold">{formatDate(r.dueDate)}</td>
                        <td className="py-2.5 font-bold text-slate-900 dark:text-white">{r.title}</td>
                        <td className="py-2.5">{r.type}</td>
                        <td className="py-2.5"><StatusBadge status={r.urgency} /></td>
                        <td className="py-2.5 text-right font-mono font-bold text-rose-600">{formatINR(r.amount)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Report Footer */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>FinTrack v2.4.0 • Verified Client-Side Calculation Engine</span>
          <span>End of Report</span>
        </div>
      </div>
    </div>
  )
}
