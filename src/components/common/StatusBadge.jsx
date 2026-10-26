import React from 'react'

const BADGE_STYLES = {
  paid: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  received: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  active: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  'due soon': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'due-soon': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'due-today': 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
  'due-tomorrow': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  overdue: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  'partially paid': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  'partially-paid': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  'advance payment': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  'advance rent': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  'security deposit': 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  closed: 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20',
}

export const StatusBadge = ({ status = 'Paid', className = '' }) => {
  const norm = String(status || '').toLowerCase().trim()
  const style = BADGE_STYLES[norm] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${style} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  )
}
