import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFinancial } from '../context/FinancialContext'
import { formatINR } from '../utils/currency'
import { formatDate } from '../utils/dateUtils'
import { EmptyState } from '../components/common/EmptyState'
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  CreditCard,
  Landmark,
  Home,
  PieChart,
  ArrowRight,
  Clock,
  ShieldAlert
} from 'lucide-react'

export const Notifications = () => {
  const {
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useFinancial()

  const [filter, setFilter] = useState('all') // 'all' | 'unread'

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead
    return true
  })

  const getIcon = (type) => {
    switch (type) {
      case 'emi':
        return CreditCard
      case 'loan':
        return Landmark
      case 'rent':
        return Home
      case 'budget':
        return PieChart
      default:
        return Bell
    }
  }

  const getTargetRoute = (type) => {
    switch (type) {
      case 'emi':
        return '/emi'
      case 'loan':
        return '/loans'
      case 'rent':
        return '/rent'
      case 'budget':
        return '/budgets'
      default:
        return '/'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
              Notification Center
            </h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Proactive alerts for upcoming obligations, overdue payments, and budget limits
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllNotificationsAsRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold transition-colors"
            >
              <CheckCheck className="w-4 h-4 text-emerald-500" />
              <span>Mark all as read</span>
            </button>
          )}

          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filter === 'unread'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <EmptyState
            icon={Bell}
            title={filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            description="You are completely up to date with your payment obligations and budget targets."
          />
        ) : (
          filteredNotifs.map((notif) => {
            const Icon = getIcon(notif.recordType)
            const targetRoute = getTargetRoute(notif.recordType)

            return (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !notif.isRead
                    ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.level === 'danger'
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                      : notif.level === 'warning'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                      : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>Amount: {formatINR(notif.amount)}</span>
                      {notif.dueDate && <span>Due: {formatDate(notif.dueDate)}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <Link
                    to={targetRoute}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-colors"
                  >
                    <span>View Record</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
