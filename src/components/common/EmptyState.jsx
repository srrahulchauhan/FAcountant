import React from 'react'
import { Inbox, Plus } from 'lucide-react'

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no entries matching your current filters or search.',
  actionText = null,
  onAction = null,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  )
}
