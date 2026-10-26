import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Plus,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useFinancial } from '../../context/FinancialContext'

const PAGE_TITLES = {
  '/': 'Financial Overview',
  '/expenses': 'Daily Expenses',
  '/categories': 'Expense Categories',
  '/emi': 'EMI Management',
  '/loans': 'Loan Management',
  '/rent': 'Rent & PG Management',
  '/transactions': 'All Transactions',
  '/budgets': 'Budgets & Targets',
  '/reports': 'Statements & Reports',
  '/notifications': 'Notification Center',
  '/settings': 'Settings & Backup'
}

export const Navbar = ({
  setIsMobileOpen,
  onOpenQuickExpense,
  onOpenQuickIncome
}) => {
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()
  const { saveStatus, unreadCount, settings } = useFinancial()

  const currentTitle = PAGE_TITLES[location.pathname] || 'Dashboard'

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Left Side: Mobile Menu Button + Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold font-heading text-slate-900 dark:text-white leading-tight">
              {currentTitle}
            </h1>
            <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
              Welcome back, {settings.profile?.name?.split(' ')[0] || 'User'}
            </p>
          </div>
        </div>

        {/* Right Side: Storage Status + Quick Actions + Theme + Notifications */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Storage Auto-Save Indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 select-none">
            {saveStatus === 'saving' && (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                <span className="text-slate-600 dark:text-slate-300">Saving...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-slate-600 dark:text-slate-300">Saved to LocalStorage</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-rose-600 dark:text-rose-400">Storage Error</span>
              </>
            )}
          </div>

          {/* Quick Action: Add Income */}
          <button
            type="button"
            onClick={onOpenQuickIncome}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs sm:text-sm font-semibold transition-all border border-emerald-500/20 active:scale-95"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>+ Income</span>
          </button>

          {/* Quick Action: Add Expense */}
          <button
            type="button"
            onClick={onOpenQuickExpense}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Expense</span>
            <span className="sm:hidden">Expense</span>
          </button>

          {/* Notification Center Link */}
          <Link
            to="/notifications"
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notification Center"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </Link>

          {/* Dark/Light Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  )
}
