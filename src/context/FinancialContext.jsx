import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import {
  STORAGE_KEYS,
  getStoredItem,
  setStoredItem,
  initializeStorage,
  generateId,
  clearAllApplicationData
} from '../services/storageService'
import {
  DEFAULT_SETTINGS,
  DEFAULT_CATEGORIES,
  DEFAULT_INCOME,
  DEFAULT_EXPENSES,
  DEFAULT_EMI_RECORDS,
  DEFAULT_EMI_PAYMENTS,
  DEFAULT_LOANS,
  DEFAULT_LOAN_PAYMENTS,
  DEFAULT_RENT_RECORDS,
  DEFAULT_RENT_PAYMENTS,
  DEFAULT_BUDGETS
} from '../services/defaultData'
import {
  calculateFinancialSummary,
  getMonthlyTrendData,
  getCategoryBreakdown
} from '../utils/calculations'
import { generateNotifications } from '../services/notificationService'
import { getNextMonthlyDueDate } from '../utils/dateUtils'
import toast from 'react-hot-toast'

const FinancialContext = createContext()

export const FinancialProvider = ({ children }) => {
  // Ensure default data initialized on first run
  initializeStorage()

  // Primary State
  const [settings, setSettings] = useState(() => getStoredItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS))
  const [categories, setCategories] = useState(() => getStoredItem(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES))
  const [income, setIncome] = useState(() => getStoredItem(STORAGE_KEYS.INCOME, DEFAULT_INCOME))
  const [expenses, setExpenses] = useState(() => getStoredItem(STORAGE_KEYS.EXPENSES, DEFAULT_EXPENSES))
  const [emiRecords, setEmiRecords] = useState(() => getStoredItem(STORAGE_KEYS.EMI_RECORDS, DEFAULT_EMI_RECORDS))
  const [emiPayments, setEmiPayments] = useState(() => getStoredItem(STORAGE_KEYS.EMI_PAYMENTS, DEFAULT_EMI_PAYMENTS))
  const [loans, setLoans] = useState(() => getStoredItem(STORAGE_KEYS.LOANS, DEFAULT_LOANS))
  const [loanPayments, setLoanPayments] = useState(() => getStoredItem(STORAGE_KEYS.LOAN_PAYMENTS, DEFAULT_LOAN_PAYMENTS))
  const [rentRecords, setRentRecords] = useState(() => getStoredItem(STORAGE_KEYS.RENT_RECORDS, DEFAULT_RENT_RECORDS))
  const [rentPayments, setRentPayments] = useState(() => getStoredItem(STORAGE_KEYS.RENT_PAYMENTS, DEFAULT_RENT_PAYMENTS))
  const [budgets, setBudgets] = useState(() => getStoredItem(STORAGE_KEYS.BUDGETS, DEFAULT_BUDGETS))
  const [readNotificationIds, setReadNotificationIds] = useState(() => getStoredItem(STORAGE_KEYS.NOTIFICATIONS, []))

  // Storage Save Indicator Status
  const [saveStatus, setSaveStatus] = useState('saved') // 'saved' | 'saving' | 'error'

  // Debounced auto-save handler
  const persistState = useCallback((key, value, setter) => {
    setSaveStatus('saving')
    setter(value)
    const success = setStoredItem(key, value)
    setTimeout(() => {
      setSaveStatus(success ? 'saved' : 'error')
    }, 200)
  }, [])

  // -------------------------
  // EXPENSES
  // -------------------------
  const addExpense = (expenseData) => {
    const newRecord = {
      ...expenseData,
      id: generateId('exp'),
      amount: Number(expenseData.amount) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updated = [newRecord, ...expenses]
    persistState(STORAGE_KEYS.EXPENSES, updated, setExpenses)
    toast.success('Expense added successfully')
    return newRecord
  }

  const updateExpense = (id, updatedData) => {
    const updated = expenses.map(item =>
      item.id === id ? { ...item, ...updatedData, amount: Number(updatedData.amount || item.amount), updatedAt: new Date().toISOString() } : item
    )
    persistState(STORAGE_KEYS.EXPENSES, updated, setExpenses)
    toast.success('Expense updated')
  }

  const deleteExpense = (id) => {
    const updated = expenses.filter(item => item.id !== id)
    persistState(STORAGE_KEYS.EXPENSES, updated, setExpenses)
    toast.success('Expense removed')
  }

  const duplicateExpense = (id) => {
    const target = expenses.find(item => item.id === id)
    if (!target) return
    const duplicated = {
      ...target,
      id: generateId('exp'),
      title: `${target.title} (Copy)`,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updated = [duplicated, ...expenses]
    persistState(STORAGE_KEYS.EXPENSES, updated, setExpenses)
    toast.success('Expense duplicated')
  }

  // -------------------------
  // INCOME
  // -------------------------
  const addIncome = (incomeData) => {
    const newRecord = {
      ...incomeData,
      id: generateId('inc'),
      amount: Number(incomeData.amount) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updated = [newRecord, ...income]
    persistState(STORAGE_KEYS.INCOME, updated, setIncome)
    toast.success('Income recorded successfully')
    return newRecord
  }

  const updateIncome = (id, updatedData) => {
    const updated = income.map(item =>
      item.id === id ? { ...item, ...updatedData, amount: Number(updatedData.amount || item.amount), updatedAt: new Date().toISOString() } : item
    )
    persistState(STORAGE_KEYS.INCOME, updated, setIncome)
    toast.success('Income updated')
  }

  const deleteIncome = (id) => {
    const updated = income.filter(item => item.id !== id)
    persistState(STORAGE_KEYS.INCOME, updated, setIncome)
    toast.success('Income removed')
  }

  // -------------------------
  // CATEGORIES
  // -------------------------
  const addCategory = (catData) => {
    const newCat = {
      ...catData,
      id: generateId('cat'),
      monthlyBudget: Number(catData.monthlyBudget) || 0,
      createdAt: new Date().toISOString()
    }
    const updated = [...categories, newCat]
    persistState(STORAGE_KEYS.CATEGORIES, updated, setCategories)
    toast.success('Category created')
    return newCat
  }

  const updateCategory = (id, catData) => {
    const prevCat = categories.find(c => c.id === id)
    const updated = categories.map(item =>
      item.id === id ? { ...item, ...catData, monthlyBudget: Number(catData.monthlyBudget || item.monthlyBudget) } : item
    )
    persistState(STORAGE_KEYS.CATEGORIES, updated, setCategories)

    // Sync expense category names if name was changed
    if (prevCat && catData.name && prevCat.name !== catData.name) {
      const updatedExpenses = expenses.map(e =>
        e.categoryId === id || e.categoryName === prevCat.name
          ? { ...e, categoryName: catData.name }
          : e
      )
      persistState(STORAGE_KEYS.EXPENSES, updatedExpenses, setExpenses)
    }
    toast.success('Category updated')
  }

  const deleteCategory = (id) => {
    const catToDelete = categories.find(c => c.id === id)
    const updated = categories.filter(item => item.id !== id)
    persistState(STORAGE_KEYS.CATEGORIES, updated, setCategories)

    // Reassign any existing expenses under this category to 'Other'
    if (catToDelete) {
      const updatedExpenses = expenses.map(e =>
        e.categoryId === id || e.categoryName === catToDelete.name
          ? { ...e, categoryId: 'cat-12', categoryName: 'Other' }
          : e
      )
      persistState(STORAGE_KEYS.EXPENSES, updatedExpenses, setExpenses)
    }
    toast.success('Category deleted')
  }

  // -------------------------
  // EMI MANAGEMENT
  // -------------------------
  const addEmiRecord = (emiData) => {
    const newEmi = {
      ...emiData,
      id: generateId('emi'),
      originalLoanAmount: Number(emiData.originalLoanAmount) || 0,
      monthlyEmiAmount: Number(emiData.monthlyEmiAmount) || 0,
      interestRate: Number(emiData.interestRate) || 0,
      totalInstallments: parseInt(emiData.totalInstallments, 10) || 12,
      paidInstallments: parseInt(emiData.paidInstallments, 10) || 0,
      status: emiData.status || 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updated = [newEmi, ...emiRecords]
    persistState(STORAGE_KEYS.EMI_RECORDS, updated, setEmiRecords)
    toast.success('EMI record added')
    return newEmi
  }

  const updateEmiRecord = (id, emiData) => {
    const updated = emiRecords.map(item =>
      item.id === id
        ? {
            ...item,
            ...emiData,
            originalLoanAmount: Number(emiData.originalLoanAmount || item.originalLoanAmount),
            monthlyEmiAmount: Number(emiData.monthlyEmiAmount || item.monthlyEmiAmount),
            totalInstallments: parseInt(emiData.totalInstallments || item.totalInstallments, 10),
            paidInstallments: parseInt(emiData.paidInstallments || item.paidInstallments, 10),
            updatedAt: new Date().toISOString()
          }
        : item
    )
    persistState(STORAGE_KEYS.EMI_RECORDS, updated, setEmiRecords)
    toast.success('EMI record updated')
  }

  const deleteEmiRecord = (id) => {
    const updated = emiRecords.filter(item => item.id !== id)
    persistState(STORAGE_KEYS.EMI_RECORDS, updated, setEmiRecords)
    toast.success('EMI record deleted')
  }

  const recordEmiPayment = (paymentData) => {
    const emi = emiRecords.find(e => e.id === paymentData.emiId)
    if (!emi) {
      toast.error('Associated EMI not found')
      return
    }

    const amountPaid = Number(paymentData.amountPaid) || 0
    const paymentType = paymentData.paymentType || 'Full'

    const newPayment = {
      ...paymentData,
      id: generateId('emip'),
      amountPaid,
      emiName: emi.emiName,
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString()
    }

    // Update installment count and next due date
    const totalInstallments = parseInt(emi.totalInstallments, 10) || 12
    let paidInstallments = parseInt(emi.paidInstallments, 10) || 0
    let nextStatus = 'Paid'

    if (paymentType === 'Full' || amountPaid >= Number(emi.monthlyEmiAmount)) {
      paidInstallments = Math.min(totalInstallments, paidInstallments + 1)
      nextStatus = paidInstallments >= totalInstallments ? 'Paid' : 'Pending'
    } else if (paymentType === 'Advance') {
      nextStatus = 'Advance Payment'
      // Advance payments recorded separately, does not prematurely mark installment
    } else {
      nextStatus = 'Partially Paid'
    }

    const nextDueDate = getNextMonthlyDueDate(emi.dueDate)

    const updatedEmi = {
      ...emi,
      paidInstallments,
      status: nextStatus,
      dueDate: nextDueDate,
      updatedAt: new Date().toISOString()
    }

    const updatedEmiList = emiRecords.map(item => item.id === emi.id ? updatedEmi : item)
    const updatedPayments = [newPayment, ...emiPayments]

    persistState(STORAGE_KEYS.EMI_RECORDS, updatedEmiList, setEmiRecords)
    persistState(STORAGE_KEYS.EMI_PAYMENTS, updatedPayments, setEmiPayments)
    toast.success('EMI payment recorded successfully')
  }

  // -------------------------
  // LOAN MANAGEMENT
  // -------------------------
  const addLoan = (loanData) => {
    const originalLoanAmount = Number(loanData.originalLoanAmount) || 0
    const totalRepaid = Number(loanData.totalRepaid) || 0
    const outstandingBalance = loanData.outstandingBalance !== undefined
      ? Number(loanData.outstandingBalance)
      : Math.max(0, originalLoanAmount - totalRepaid)

    const newLoan = {
      ...loanData,
      id: generateId('loan'),
      originalLoanAmount,
      totalRepaid,
      outstandingBalance,
      monthlyPaymentAmount: Number(loanData.monthlyPaymentAmount) || 0,
      interestRate: Number(loanData.interestRate) || 0,
      status: outstandingBalance <= 0 ? 'Closed' : 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updated = [newLoan, ...loans]
    persistState(STORAGE_KEYS.LOANS, updated, setLoans)
    toast.success('Loan record added')
    return newLoan
  }

  const updateLoan = (id, loanData) => {
    const updated = loans.map(item => {
      if (item.id === id) {
        const originalLoanAmount = Number(loanData.originalLoanAmount || item.originalLoanAmount)
        const totalRepaid = Number(loanData.totalRepaid !== undefined ? loanData.totalRepaid : item.totalRepaid)
        const outstandingBalance = loanData.outstandingBalance !== undefined
          ? Number(loanData.outstandingBalance)
          : Math.max(0, originalLoanAmount - totalRepaid)

        return {
          ...item,
          ...loanData,
          originalLoanAmount,
          totalRepaid,
          outstandingBalance,
          monthlyPaymentAmount: Number(loanData.monthlyPaymentAmount || item.monthlyPaymentAmount),
          status: outstandingBalance <= 0 ? 'Closed' : (loanData.status || item.status || 'Active'),
          updatedAt: new Date().toISOString()
        }
      }
      return item
    })
    persistState(STORAGE_KEYS.LOANS, updated, setLoans)
    toast.success('Loan updated')
  }

  const deleteLoan = (id) => {
    const updated = loans.filter(item => item.id !== id)
    persistState(STORAGE_KEYS.LOANS, updated, setLoans)
    toast.success('Loan deleted')
  }

  const recordLoanPayment = (paymentData) => {
    const loan = loans.find(l => l.id === paymentData.loanId)
    if (!loan) {
      toast.error('Loan not found')
      return
    }

    const amountPaid = Number(paymentData.amountPaid) || 0
    const newPayment = {
      ...paymentData,
      id: generateId('loanp'),
      loanName: loan.loanName,
      amountPaid,
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString()
    }

    const newTotalRepaid = (Number(loan.totalRepaid) || 0) + amountPaid
    const newOutstanding = Math.max(0, (Number(loan.outstandingBalance) || (Number(loan.originalLoanAmount) - Number(loan.totalRepaid))) - amountPaid)
    const nextDueDate = getNextMonthlyDueDate(loan.nextDueDate)

    const updatedLoan = {
      ...loan,
      totalRepaid: newTotalRepaid,
      outstandingBalance: newOutstanding,
      nextDueDate,
      status: newOutstanding <= 0 ? 'Closed' : 'Active',
      updatedAt: new Date().toISOString()
    }

    const updatedLoanList = loans.map(item => item.id === loan.id ? updatedLoan : item)
    const updatedPayments = [newPayment, ...loanPayments]

    persistState(STORAGE_KEYS.LOANS, updatedLoanList, setLoans)
    persistState(STORAGE_KEYS.LOAN_PAYMENTS, updatedPayments, setLoanPayments)
    toast.success('Loan repayment recorded')
  }

  // -------------------------
  // RENT MANAGEMENT
  // -------------------------
  const addRentRecord = (rentData) => {
    const newRent = {
      ...rentData,
      id: generateId('rent'),
      monthlyRent: Number(rentData.monthlyRent) || 0,
      securityDeposit: Number(rentData.securityDeposit) || 0,
      monthlyDueDay: parseInt(rentData.monthlyDueDay, 10) || 5,
      status: rentData.status || 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updated = [newRent, ...rentRecords]
    persistState(STORAGE_KEYS.RENT_RECORDS, updated, setRentRecords)
    toast.success('Rental property added')
    return newRent
  }

  const updateRentRecord = (id, rentData) => {
    const updated = rentRecords.map(item =>
      item.id === id
        ? {
            ...item,
            ...rentData,
            monthlyRent: Number(rentData.monthlyRent || item.monthlyRent),
            securityDeposit: Number(rentData.securityDeposit || item.securityDeposit),
            updatedAt: new Date().toISOString()
          }
        : item
    )
    persistState(STORAGE_KEYS.RENT_RECORDS, updated, setRentRecords)
    toast.success('Rental property updated')
  }

  const deleteRentRecord = (id) => {
    const updated = rentRecords.filter(item => item.id !== id)
    persistState(STORAGE_KEYS.RENT_RECORDS, updated, setRentRecords)
    toast.success('Rental property removed')
  }

  const recordRentPayment = (paymentData) => {
    const rent = rentRecords.find(r => r.id === paymentData.rentId)
    if (!rent) {
      toast.error('Rental record not found')
      return
    }

    const amountPaid = Number(paymentData.amountPaid) || 0
    const newPayment = {
      ...paymentData,
      id: generateId('rentp'),
      propertyName: rent.propertyName,
      amountPaid,
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString()
    }

    let nextDueDate = rent.nextDueDate
    let nextStatus = 'Paid'

    // If regular monthly rent, update next month due date
    if (paymentData.paymentType === 'Monthly Rent' || paymentData.paymentType === 'Full') {
      nextDueDate = getNextMonthlyDueDate(rent.nextDueDate, rent.monthlyDueDay)
    }

    const updatedRent = {
      ...rent,
      nextDueDate,
      status: nextStatus,
      updatedAt: new Date().toISOString()
    }

    const updatedRentList = rentRecords.map(item => item.id === rent.id ? updatedRent : item)
    const updatedPayments = [newPayment, ...rentPayments]

    persistState(STORAGE_KEYS.RENT_RECORDS, updatedRentList, setRentRecords)
    persistState(STORAGE_KEYS.RENT_PAYMENTS, updatedPayments, setRentPayments)
    toast.success('Rent payment recorded')
  }

  // -------------------------
  // BUDGETS
  // -------------------------
  const updateBudgets = (newBudgets) => {
    persistState(STORAGE_KEYS.BUDGETS, newBudgets, setBudgets)
    toast.success('Budgets saved')
  }

  // -------------------------
  // SETTINGS
  // -------------------------
  const updateSettings = (newSettings) => {
    persistState(STORAGE_KEYS.SETTINGS, newSettings, setSettings)
    toast.success('Settings updated')
  }

  // -------------------------
  // NOTIFICATIONS
  // -------------------------
  const markNotificationAsRead = (notifId) => {
    if (!readNotificationIds.includes(notifId)) {
      const updated = [...readNotificationIds, notifId]
      persistState(STORAGE_KEYS.NOTIFICATIONS, updated, setReadNotificationIds)
    }
  }

  const markAllNotificationsAsRead = () => {
    const allIds = activeNotifications.map(n => n.id)
    persistState(STORAGE_KEYS.NOTIFICATIONS, allIds, setReadNotificationIds)
    toast.success('All notifications marked as read')
  }

  // -------------------------
  // BACKUP & RESTORE / RESET
  // -------------------------
  const restoreAllData = (backupData) => {
    if (backupData[STORAGE_KEYS.SETTINGS]) setSettings(backupData[STORAGE_KEYS.SETTINGS])
    if (backupData[STORAGE_KEYS.CATEGORIES]) setCategories(backupData[STORAGE_KEYS.CATEGORIES])
    if (backupData[STORAGE_KEYS.INCOME]) setIncome(backupData[STORAGE_KEYS.INCOME])
    if (backupData[STORAGE_KEYS.EXPENSES]) setExpenses(backupData[STORAGE_KEYS.EXPENSES])
    if (backupData[STORAGE_KEYS.EMI_RECORDS]) setEmiRecords(backupData[STORAGE_KEYS.EMI_RECORDS])
    if (backupData[STORAGE_KEYS.EMI_PAYMENTS]) setEmiPayments(backupData[STORAGE_KEYS.EMI_PAYMENTS])
    if (backupData[STORAGE_KEYS.LOANS]) setLoans(backupData[STORAGE_KEYS.LOANS])
    if (backupData[STORAGE_KEYS.LOAN_PAYMENTS]) setLoanPayments(backupData[STORAGE_KEYS.LOAN_PAYMENTS])
    if (backupData[STORAGE_KEYS.RENT_RECORDS]) setRentRecords(backupData[STORAGE_KEYS.RENT_RECORDS])
    if (backupData[STORAGE_KEYS.RENT_PAYMENTS]) setRentPayments(backupData[STORAGE_KEYS.RENT_PAYMENTS])
    if (backupData[STORAGE_KEYS.BUDGETS]) setBudgets(backupData[STORAGE_KEYS.BUDGETS])
    toast.success('Data restored successfully!')
  }

  const resetAllData = () => {
    clearAllApplicationData()
    setSettings(DEFAULT_SETTINGS)
    setCategories(DEFAULT_CATEGORIES)
    setIncome([])
    setExpenses([])
    setEmiRecords([])
    setEmiPayments([])
    setLoans([])
    setLoanPayments([])
    setRentRecords([])
    setRentPayments([])
    setBudgets(DEFAULT_BUDGETS)
    setReadNotificationIds([])
    toast.success('All data has been reset')
  }

  // Calculated Real-Time Summaries
  const financialSummary = useMemo(() => {
    return calculateFinancialSummary({
      income,
      expenses,
      emiRecords,
      emiPayments,
      loans,
      loanPayments,
      rentRecords,
      rentPayments
    })
  }, [income, expenses, emiRecords, emiPayments, loans, loanPayments, rentRecords, rentPayments])

  const monthlyTrend = useMemo(() => {
    return getMonthlyTrendData({
      income,
      expenses,
      emiPayments,
      loanPayments,
      rentPayments
    })
  }, [income, expenses, emiPayments, loanPayments, rentPayments])

  const categoryBreakdown = useMemo(() => {
    return getCategoryBreakdown({
      expenses,
      categories
    })
  }, [expenses, categories])

  const activeNotifications = useMemo(() => {
    return generateNotifications({
      emiRecords,
      loans,
      rentRecords,
      expenses,
      budgets,
      categories,
      readNotificationIds
    })
  }, [emiRecords, loans, rentRecords, expenses, budgets, categories, readNotificationIds])

  const unreadCount = useMemo(() => {
    return activeNotifications.filter(n => !n.isRead).length
  }, [activeNotifications])

  const value = {
    settings,
    categories,
    income,
    expenses,
    emiRecords,
    emiPayments,
    loans,
    loanPayments,
    rentRecords,
    rentPayments,
    budgets,
    saveStatus,
    financialSummary,
    monthlyTrend,
    categoryBreakdown,
    notifications: activeNotifications,
    unreadCount,
    // Operations
    addExpense,
    updateExpense,
    deleteExpense,
    duplicateExpense,
    addIncome,
    updateIncome,
    deleteIncome,
    addCategory,
    updateCategory,
    deleteCategory,
    addEmiRecord,
    updateEmiRecord,
    deleteEmiRecord,
    recordEmiPayment,
    addLoan,
    updateLoan,
    deleteLoan,
    recordLoanPayment,
    addRentRecord,
    updateRentRecord,
    deleteRentRecord,
    recordRentPayment,
    updateBudgets,
    updateSettings,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    restoreAllData,
    resetAllData
  }

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  )
}

export const useFinancial = () => useContext(FinancialContext)
