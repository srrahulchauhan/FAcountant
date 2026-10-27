import React, { useState, useMemo } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { useFinancial } from '../context/FinancialContext'
import { SummaryCard } from '../components/dashboard/SummaryCard'
import { IncomeExpenseChart } from '../components/dashboard/IncomeExpenseChart'
import { CategoryPieChart } from '../components/dashboard/CategoryPieChart'
import { UpcomingPayments } from '../components/dashboard/UpcomingPayments'
import { BudgetProgressSection } from '../components/dashboard/BudgetProgressSection'
import { RecentTransactions } from '../components/dashboard/RecentTransactions'
import { AnimatedNumber } from '../components/common/AnimatedNumber'
import { formatINR } from '../utils/currency'
import {
  Wallet,
  ArrowDownLeft,
  Calendar,
  CreditCard,
  Landmark,
  Home,
  Clock,
  AlertCircle,
  AlertTriangle,
  Receipt,
  Plus,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react'
import {
  isDateToday,
  isDateInCurrentWeek,
  isDateInCurrentMonth,
  isDateInCurrentYear
} from '../utils/dateUtils'

export const Dashboard = () => {
  const {
    financialSummary,
    monthlyTrend,
    categoryBreakdown,
    expenses,
    income,
    emiRecords,
    emiPayments,
    loans,
    loanPayments,
    rentRecords,
    rentPayments,
    budgets,
    categories
  } = useFinancial()

  const {
    openPayEmi,
    openPayLoan,
    openPayRent,
    openQuickExpense,
    openQuickIncome
  } = useOutletContext()

  const navigate = useNavigate()

  // Dashboard Time Filter: 'all' | 'today' | 'week' | 'month' | 'year'
  const [timeFilter, setTimeFilter] = useState('month')

  // Filtered amounts based on selected time horizon
  const filteredMetrics = useMemo(() => {
    let checkDate = () => true
    if (timeFilter === 'today') checkDate = isDateToday
    else if (timeFilter === 'week') checkDate = isDateInCurrentWeek
    else if (timeFilter === 'month') checkDate = isDateInCurrentMonth
    else if (timeFilter === 'year') checkDate = isDateInCurrentYear

    const filteredIncome = income.filter(i => checkDate(i.date)).reduce((a, b) => a + Number(b.amount || 0), 0)

    const filteredExpensesDaily = expenses
      .filter(e => (e.paymentStatus || 'Paid').toLowerCase() === 'paid' && checkDate(e.date))
      .reduce((a, b) => a + Number(b.amount || 0), 0)

    const filteredEmi = emiPayments
      .filter(p => checkDate(p.paymentDate))
      .reduce((a, b) => a + Number(b.amountPaid || 0), 0)

    const filteredLoan = loanPayments
      .filter(p => checkDate(p.paymentDate))
      .reduce((a, b) => a + Number(b.amountPaid || 0), 0)

    const filteredRent = rentPayments
      .filter(p => checkDate(p.paymentDate) && p.paymentType !== 'Security Deposit')
      .reduce((a, b) => a + Number(b.amountPaid || 0), 0)

    const totalFilterExpenses = filteredExpensesDaily + filteredEmi + filteredLoan + filteredRent
    const totalFilterBalance = filteredIncome - totalFilterExpenses

    return {
      income: filteredIncome,
      expenses: totalFilterExpenses,
      balance: totalFilterBalance
    }
  }, [timeFilter, income, expenses, emiPayments, loanPayments, rentPayments])

  const activeBalance = timeFilter === 'all' ? financialSummary.totalAvailableBalance : filteredMetrics.balance
  const activeIncome = timeFilter === 'all' ? financialSummary.totalIncome : filteredMetrics.income
  const activeExpense = timeFilter === 'all' ? financialSummary.totalExpenses : filteredMetrics.expenses
  const savingsRate = activeIncome > 0 ? Math.max(0, ((activeBalance / activeIncome) * 100)).toFixed(0) : 0

  return (
    <div className="space-y-6">
      {/* Top Bar: Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
              Executive Summary
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time calculations of assets, liabilities, and monthly cashflows
          </p>
        </div>

        {/* Time Period Filter Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm self-start sm:self-auto overflow-x-auto max-w-full">
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'year', label: 'This Year' },
            { id: 'all', label: 'All Time' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTimeFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                timeFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Executive Hero Cards (Top Balance & Income Flow) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Hero Card 1: Total Available Balance with Live Gradient Ambient Glow */}
        <div
          onClick={() => navigate('/transactions')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              navigate('/transactions')
            }
          }}
          className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 p-6 sm:p-7 text-white shadow-xl border border-indigo-500/20 group hover:shadow-2xl hover:shadow-indigo-500/15 transition-all duration-300 cursor-pointer active:scale-[0.99] select-none hover:border-indigo-400/40"
        >
          {/* Animated decorative background mesh */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl -translate-y-12 translate-x-12 animate-pulse-glow pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl translate-y-12 -translate-x-12 pointer-events-none" />

          {/* Clickable Quick Action Indicator */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1 group-hover:translate-x-0 z-20">
            <span className="px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/20 flex items-center gap-1 shadow-sm">
              <span>View Ledger</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-radar absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <p className="text-xs font-bold tracking-widest uppercase text-indigo-200/90">
                    {timeFilter === 'all' ? 'Total Available Balance' : `Net Balance (${timeFilter})`}
                  </p>
                </div>

                <div className="flex items-baseline gap-3">
                  <h3 className="text-3xl sm:text-4xl 2xl:text-5xl font-black font-heading tracking-tight font-mono text-white">
                    <AnimatedNumber value={activeBalance} />
                  </h3>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {savingsRate}% Savings Rate
                  </span>
                </div>
                <p className="mt-1 text-xs text-indigo-200/80">
                  Consolidated liquid net worth across all bank accounts and cash holdings • Click to view all transactions
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 transition-transform">
                <Wallet className="w-7 h-7 text-indigo-300" />
              </div>
            </div>

            {/* Quick Action Ribbon inside Hero */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4 text-indigo-200 font-mono">
                <div>
                  <span className="text-[10px] uppercase block text-indigo-300">Income Inflow</span>
                  <span className="font-bold text-emerald-400">+{formatINR(activeIncome)}</span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div>
                  <span className="text-[10px] uppercase block text-indigo-300">Total Outflow</span>
                  <span className="font-bold text-rose-300">-{formatINR(activeExpense)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={openQuickIncome}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-semibold border border-emerald-500/30 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  + Income
                </button>
                <button
                  type="button"
                  onClick={openQuickExpense}
                  className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-indigo-50 font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Card 2: Income Stream & Cashflow Burn Ratio */}
        <div
          onClick={() => navigate('/transactions')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              navigate('/transactions')
            }
          }}
          className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer active:scale-[0.99] select-none hover:border-emerald-500/40"
        >
          {/* Clickable Quick Action Indicator */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1 group-hover:translate-x-0 z-20">
            <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 shadow-sm">
              <span>View Inflows</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                {timeFilter === 'all' ? 'Total Income Generated' : `Income Inflow (${timeFilter})`}
              </p>
              <h3 className="text-2xl sm:text-3xl font-black font-heading text-emerald-600 dark:text-emerald-400 font-mono">
                <AnimatedNumber value={activeIncome} />
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Salary, freelance revenue & dividends • Click to view
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
              <ArrowDownLeft className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-500">Expense vs Income Burn</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">
                {activeIncome > 0 ? ((activeExpense / activeIncome) * 100).toFixed(0) : 0}% Outflow
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-rose-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, activeIncome > 0 ? (activeExpense / activeIncome) * 100 : 0)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {activeIncome >= activeExpense ? 'Operating at safe positive cashflow' : 'Outflow exceeds income in this period'}
            </p>
          </div>
        </div>
      </div>

      {/* 8 Focused Metric Cards in Spacious 4-Column Grid (All Clickable) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* 3. Today's Expenses */}
        <SummaryCard
          title="Today's Expenses"
          amount={financialSummary.todayExpenses}
          icon={Receipt}
          variant="amber"
          subtitle="Cleared expenses today"
          onClick={() => navigate('/expenses')}
        />

        {/* 4. Monthly Expenses */}
        <SummaryCard
          title="Monthly Expenses"
          amount={timeFilter === 'all' || timeFilter === 'month' ? financialSummary.monthlyExpenses : filteredMetrics.expenses}
          icon={Calendar}
          variant="purple"
          subtitle="Current calendar month"
          onClick={() => navigate('/expenses')}
        />

        {/* 5. Total EMI Paid */}
        <SummaryCard
          title="Total EMI Paid"
          amount={financialSummary.totalEmiPaid}
          icon={CreditCard}
          variant="blue"
          subtitle={`${emiPayments.length} installments completed`}
          onClick={() => navigate('/emi')}
        />

        {/* 6. Outstanding Loans */}
        <SummaryCard
          title="Outstanding Loans"
          amount={financialSummary.outstandingLoans}
          icon={Landmark}
          variant="rose"
          subtitle={`${loans.length} active borrowings`}
          onClick={() => navigate('/loans')}
        />

        {/* 7. Monthly Rent */}
        <SummaryCard
          title="Monthly Rent Obligation"
          amount={financialSummary.monthlyRent}
          icon={Home}
          variant="cyan"
          subtitle={`${rentRecords.length} rental properties`}
          onClick={() => navigate('/rent')}
        />

        {/* 8. Upcoming Payments */}
        <SummaryCard
          title="Upcoming Payments"
          amount={financialSummary.upcomingPayments.amount}
          count={financialSummary.upcomingPayments.count}
          icon={Clock}
          variant="indigo"
          subtitle="Due in next 7 days"
          showPulse={financialSummary.upcomingPayments.count > 0}
          onClick={() => navigate('/notifications')}
        />

        {/* 9. Pending Payments */}
        <SummaryCard
          title="Pending Payments"
          amount={financialSummary.pendingPayments.amount}
          count={financialSummary.pendingPayments.count}
          icon={AlertCircle}
          variant="amber"
          subtitle="Unsettled obligations"
          showPulse={financialSummary.pendingPayments.count > 0}
          onClick={() => navigate('/transactions')}
        />

        {/* 10. Overdue Payments */}
        <SummaryCard
          title="Overdue Payments"
          amount={financialSummary.overduePayments.amount}
          count={financialSummary.overduePayments.count}
          icon={AlertTriangle}
          variant="rose"
          subtitle={financialSummary.overduePayments.count > 0 ? 'Requires attention' : 'All cleared'}
          showPulse={financialSummary.overduePayments.count > 0}
          onClick={() => navigate('/notifications')}
        />
      </div>

      {/* Interactive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncomeExpenseChart data={monthlyTrend} />
        </div>
        <div className="lg:col-span-1">
          <CategoryPieChart data={categoryBreakdown} />
        </div>
      </div>

      {/* Middle Row: Reminders & Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingPayments
          reminders={financialSummary.reminders}
          onPayEmi={openPayEmi}
          onPayLoan={openPayLoan}
          onPayRent={openPayRent}
        />
        <BudgetProgressSection
          budgets={budgets}
          categories={categories}
          monthlyExpenses={financialSummary.monthlyExpenses}
          categoryBreakdown={categoryBreakdown}
        />
      </div>

      {/* Bottom Row: Recent Activity Table */}
      <RecentTransactions
        expenses={expenses}
        income={income}
        emiPayments={emiPayments}
        loanPayments={loanPayments}
        rentPayments={rentPayments}
      />
    </div>
  )
}
