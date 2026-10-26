import React from 'react'
import { Modal } from './Modal'
import { Receipt, Download } from 'lucide-react'

export const ReceiptModal = ({ isOpen, onClose, receiptImage, title = 'Receipt Image' }) => {
  if (!receiptImage) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="max-h-[70vh] overflow-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900/5 dark:bg-slate-950 p-2">
          <img
            src={receiptImage}
            alt="Transaction Receipt"
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>
        <div className="mt-4 flex justify-end w-full">
          <a
            href={receiptImage}
            download="Receipt.png"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Image
          </a>
        </div>
      </div>
    </Modal>
  )
}
