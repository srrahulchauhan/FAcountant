import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  className = ''
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(totalItems, currentPage * pageSize)

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 ${className}`}>
      <div>
        Showing <span className="font-semibold text-slate-900 dark:text-white">{startItem}</span> to{' '}
        <span className="font-semibold text-slate-900 dark:text-white">{endItem}</span> of{' '}
        <span className="font-semibold text-slate-900 dark:text-white">{totalItems}</span> entries
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 py-1 rounded-lg font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
