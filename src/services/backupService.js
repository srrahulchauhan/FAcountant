import { STORAGE_KEYS, setStoredItem } from './storageService'

export const exportJSONBackup = () => {
  const backupData = {
    app: 'FinTrack Personal Accountant',
    version: '2.4.0',
    exportDate: new Date().toISOString(),
    data: {}
  }

  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    try {
      const raw = localStorage.getItem(key)
      backupData.data[key] = raw ? JSON.parse(raw) : null
    } catch {
      backupData.data[key] = null
    }
  })

  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const dateStr = new Date().toISOString().split('T')[0]
  a.href = url
  a.download = `FinTrack_Backup_${dateStr}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Validate imported JSON backup structure
 */
export const validateBackupFile = (parsedData) => {
  if (!parsedData || typeof parsedData !== 'object') {
    return { valid: false, error: 'Invalid JSON file: file is empty or corrupted.' }
  }

  const data = parsedData.data || parsedData
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Backup does not contain valid application data.' }
  }

  const summary = {
    expenses: Array.isArray(data[STORAGE_KEYS.EXPENSES]) ? data[STORAGE_KEYS.EXPENSES].length : 0,
    income: Array.isArray(data[STORAGE_KEYS.INCOME]) ? data[STORAGE_KEYS.INCOME].length : 0,
    categories: Array.isArray(data[STORAGE_KEYS.CATEGORIES]) ? data[STORAGE_KEYS.CATEGORIES].length : 0,
    emiRecords: Array.isArray(data[STORAGE_KEYS.EMI_RECORDS]) ? data[STORAGE_KEYS.EMI_RECORDS].length : 0,
    emiPayments: Array.isArray(data[STORAGE_KEYS.EMI_PAYMENTS]) ? data[STORAGE_KEYS.EMI_PAYMENTS].length : 0,
    loans: Array.isArray(data[STORAGE_KEYS.LOANS]) ? data[STORAGE_KEYS.LOANS].length : 0,
    loanPayments: Array.isArray(data[STORAGE_KEYS.LOAN_PAYMENTS]) ? data[STORAGE_KEYS.LOAN_PAYMENTS].length : 0,
    rentRecords: Array.isArray(data[STORAGE_KEYS.RENT_RECORDS]) ? data[STORAGE_KEYS.RENT_RECORDS].length : 0,
    rentPayments: Array.isArray(data[STORAGE_KEYS.RENT_PAYMENTS]) ? data[STORAGE_KEYS.RENT_PAYMENTS].length : 0,
  }

  const totalRecords = Object.values(summary).reduce((a, b) => a + b, 0)
  if (totalRecords === 0 && !data[STORAGE_KEYS.SETTINGS]) {
    return { valid: false, error: 'Backup contains zero recognized financial records.' }
  }

  return {
    valid: true,
    summary,
    totalRecords,
    exportDate: parsedData.exportDate || 'Unknown',
    dataToRestore: data
  }
}

/**
 * Restore data from validated backup
 */
export const restoreBackupData = (dataToRestore) => {
  Object.values(STORAGE_KEYS).forEach(key => {
    if (dataToRestore[key] !== undefined && dataToRestore[key] !== null) {
      setStoredItem(key, dataToRestore[key])
    }
  })
}
