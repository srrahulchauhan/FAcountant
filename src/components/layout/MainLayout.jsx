import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { Modal } from '../common/Modal'
import { ExpenseForm } from '../../forms/ExpenseForm'
import { IncomeForm } from '../../forms/IncomeForm'
import { EMIPaymentForm } from '../../forms/EMIPaymentForm'
import { LoanPaymentForm } from '../../forms/LoanPaymentForm'
import { RentPaymentForm } from '../../forms/RentPaymentForm'
import { useFinancial } from '../../context/FinancialContext'
import { Toaster } from 'react-hot-toast'

export const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Quick Action Modal states
  const [isQuickExpenseOpen, setIsQuickExpenseOpen] = useState(false)
  const [isQuickIncomeOpen, setIsQuickIncomeOpen] = useState(false)
  const [quickPayEmiId, setQuickPayEmiId] = useState(null)
  const [quickPayLoanId, setQuickPayLoanId] = useState(null)
  const [quickPayRentId, setQuickPayRentId] = useState(null)

  const {
    addExpense,
    addIncome,
    recordEmiPayment,
    recordLoanPayment,
    recordRentPayment
  } = useFinancial()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar
          setIsMobileOpen={setIsMobileOpen}
          onOpenQuickExpense={() => setIsQuickExpenseOpen(true)}
          onOpenQuickIncome={() => setIsQuickIncomeOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Provide outlet context for triggering payment modals from any child page */}
          <Outlet
            context={{
              openPayEmi: (emiId) => setQuickPayEmiId(emiId),
              openPayLoan: (loanId) => setQuickPayLoanId(loanId),
              openPayRent: (rentId) => setQuickPayRentId(rentId),
              openQuickExpense: () => setIsQuickExpenseOpen(true),
              openQuickIncome: () => setIsQuickIncomeOpen(true)
            }}
          />
        </main>
      </div>

      {/* Quick Add Expense Modal */}
      <Modal
        isOpen={isQuickExpenseOpen}
        onClose={() => setIsQuickExpenseOpen(false)}
        title="Add Daily Expense"
        subtitle="Record a new transaction with category and receipt"
      >
        <ExpenseForm
          onSubmit={(data) => {
            addExpense(data)
            setIsQuickExpenseOpen(false)
          }}
          onCancel={() => setIsQuickExpenseOpen(false)}
        />
      </Modal>

      {/* Quick Add Income Modal */}
      <Modal
        isOpen={isQuickIncomeOpen}
        onClose={() => setIsQuickIncomeOpen(false)}
        title="Record New Income"
        subtitle="Log salary, freelance payouts, or investment returns"
      >
        <IncomeForm
          onSubmit={(data) => {
            addIncome(data)
            setIsQuickIncomeOpen(false)
          }}
          onCancel={() => setIsQuickIncomeOpen(false)}
        />
      </Modal>

      {/* Quick Record EMI Payment Modal */}
      <Modal
        isOpen={quickPayEmiId !== null}
        onClose={() => setQuickPayEmiId(null)}
        title="Record EMI Payment"
        subtitle="Update installment count and next due date"
      >
        <EMIPaymentForm
          defaultEmiId={quickPayEmiId}
          onSubmit={(data) => {
            recordEmiPayment(data)
            setQuickPayEmiId(null)
          }}
          onCancel={() => setQuickPayEmiId(null)}
        />
      </Modal>

      {/* Quick Record Loan Payment Modal */}
      <Modal
        isOpen={quickPayLoanId !== null}
        onClose={() => setQuickPayLoanId(null)}
        title="Record Loan Repayment"
        subtitle="Deduct from outstanding loan balance"
      >
        <LoanPaymentForm
          defaultLoanId={quickPayLoanId}
          onSubmit={(data) => {
            recordLoanPayment(data)
            setQuickPayLoanId(null)
          }}
          onCancel={() => setQuickPayLoanId(null)}
        />
      </Modal>

      {/* Quick Record Rent Payment Modal */}
      <Modal
        isOpen={quickPayRentId !== null}
        onClose={() => setQuickPayRentId(null)}
        title="Record Monthly Rent Payment"
        subtitle="Keep rental history organized and update scheduled due date"
      >
        <RentPaymentForm
          defaultRentId={quickPayRentId}
          onSubmit={(data) => {
            recordRentPayment(data)
            setQuickPayRentId(null)
          }}
          onCancel={() => setQuickPayRentId(null)}
        />
      </Modal>

      {/* Toast Notification Provider */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl text-xs font-semibold',
          duration: 3500
        }}
      />
    </div>
  )
}
