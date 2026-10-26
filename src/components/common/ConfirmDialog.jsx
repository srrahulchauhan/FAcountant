import React, { useState } from 'react'
import { Modal } from './Modal'
import { AlertTriangle } from 'lucide-react'

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  danger = true,
  requirePhrase = null // Optional confirmation string like 'DELETE ALL DATA'
}) => {
  const [typedPhrase, setTypedPhrase] = useState('')

  const isConfirmedDisabled = requirePhrase ? typedPhrase.trim() !== requirePhrase : false

  const handleConfirm = () => {
    if (isConfirmedDisabled) return
    onConfirm()
    setTypedPhrase('')
    onClose()
  }

  const handleCancel = () => {
    setTypedPhrase('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
          danger ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
        }`}>
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {message}
        </p>

        {requirePhrase && (
          <div className="w-full mt-4 text-left">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Type <span className="font-mono font-bold text-rose-600 dark:text-rose-400 select-all">{requirePhrase}</span> to confirm:
            </label>
            <input
              type="text"
              value={typedPhrase}
              onChange={(e) => setTypedPhrase(e.target.value)}
              placeholder={requirePhrase}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-rose-500 font-mono"
            />
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-3 w-full">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isConfirmedDisabled}
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium shadow-md transition-all ${
              danger
                ? 'bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}
