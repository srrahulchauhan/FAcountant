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
} from './defaultData'

export const STORAGE_KEYS = {
  SETTINGS: 'personal_accountant_settings',
  INCOME: 'personal_accountant_income',
  EXPENSES: 'personal_accountant_expenses',
  CATEGORIES: 'personal_accountant_categories',
  EMI_RECORDS: 'personal_accountant_emi_records',
  EMI_PAYMENTS: 'personal_accountant_emi_payments',
  LOANS: 'personal_accountant_loans',
  LOAN_PAYMENTS: 'personal_accountant_loan_payments',
  RENT_RECORDS: 'personal_accountant_rent_records',
  RENT_PAYMENTS: 'personal_accountant_rent_payments',
  BUDGETS: 'personal_accountant_budgets',
  NOTIFICATIONS: 'personal_accountant_notifications'
}

export const generateId = (prefix = 'rec') => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
}

/**
 * Safe getItem with fallback
 */
export const getStoredItem = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null || raw === undefined) return fallback
    return JSON.parse(raw)
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err)
    return fallback
  }
}

/**
 * Safe setItem
 */
export const setStoredItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err)
    return false
  }
}

/**
 * Initialize storage with default data if empty (preserves existing user data!)
 */
export const initializeStorage = () => {
  const isFirstRun = localStorage.getItem(STORAGE_KEYS.SETTINGS) === null

  if (isFirstRun) {
    setStoredItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
    setStoredItem(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES)
    setStoredItem(STORAGE_KEYS.INCOME, DEFAULT_INCOME)
    setStoredItem(STORAGE_KEYS.EXPENSES, DEFAULT_EXPENSES)
    setStoredItem(STORAGE_KEYS.EMI_RECORDS, DEFAULT_EMI_RECORDS)
    setStoredItem(STORAGE_KEYS.EMI_PAYMENTS, DEFAULT_EMI_PAYMENTS)
    setStoredItem(STORAGE_KEYS.LOANS, DEFAULT_LOANS)
    setStoredItem(STORAGE_KEYS.LOAN_PAYMENTS, DEFAULT_LOAN_PAYMENTS)
    setStoredItem(STORAGE_KEYS.RENT_RECORDS, DEFAULT_RENT_RECORDS)
    setStoredItem(STORAGE_KEYS.RENT_PAYMENTS, DEFAULT_RENT_PAYMENTS)
    setStoredItem(STORAGE_KEYS.BUDGETS, DEFAULT_BUDGETS)
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, [])
  }
}

/**
 * Calculate LocalStorage storage usage in KB
 */
export const getStorageStats = () => {
  let totalBytes = 0
  const counts = {}

  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const val = localStorage.getItem(key) || ''
    const bytes = val.length * 2 // UTF-16
    totalBytes += bytes

    try {
      const parsed = JSON.parse(val || '[]')
      counts[name] = Array.isArray(parsed) ? parsed.length : 1
    } catch {
      counts[name] = 0
    }
  })

  return {
    usedKB: (totalBytes / 1024).toFixed(2),
    counts
  }
}

/**
 * Clear all application data
 */
export const clearAllApplicationData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
}
