import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Receipt,
  Tags,
  CreditCard,
  Landmark,
  Home,
  ArrowLeftRight,
  BarChart3,
  Bell,
  PieChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  HardDrive
} from 'lucide-react'
import { useFinancial } from '../../context/FinancialContext'

const NAV_ITEMS = [
  { path: '/', label: 'Overview Dashboard', icon: LayoutDashboard },
  { path: '/expenses', label: 'Daily Expenses', icon: Receipt },
  { path: '/categories', label: 'Categories', icon: Tags },
  { path: '/emi', label: 'EMI Management', icon: CreditCard },
  { path: '/loans', label: 'Loan Management', icon: Landmark },
  { path: '/rent', label: 'Rent / PG Management', icon: Home },
  { path: '/transactions', label: 'All Transactions', icon: ArrowLeftRight },
  { path: '/budgets', label: 'Budgets', icon: PieChart },
  { path: '/reports', label: 'Statements & Reports', icon: BarChart3 },
  { path: '/notifications', label: 'Notifications', icon: Bell, hasBadge: true },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const { unreadCount, settings } = useFinancial()

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
            ₹
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight font-heading text-slate-900 dark:text-white">
                FinTrack
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
                Personal Accountant
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                    }`}
                  />
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {item.hasBadge && unreadCount > 0 && (
                    <span
                      className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full ${
                        isActive
                          ? 'bg-white text-indigo-700'
                          : 'bg-rose-500 text-white animate-pulse'
                      }`}
                    >
                      {unreadCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </div>

      {/* Storage & User Status Card */}
      {(!isCollapsed || isMobileOpen) && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
              {settings.profile?.name ? settings.profile.name.charAt(0) : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {settings.profile?.name || 'Aakash Sharma'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  LocalStorage Persistent
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="fixed top-0 bottom-0 left-0 z-30 transition-all duration-300" style={{ width: isCollapsed ? '5rem' : '16rem' }}>
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed top-0 bottom-0 left-0 w-72 z-50 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
