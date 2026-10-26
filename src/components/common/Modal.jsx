import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  className = ''
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          className={`relative w-full ${maxWidth} transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-left shadow-2xl transition-all ${className}`}
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              {title && (
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  )
}
