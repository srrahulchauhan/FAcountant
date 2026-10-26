/**
 * Form validation helpers
 */

export const validateRequired = (val, fieldName = 'Field') => {
  if (val === undefined || val === null || String(val).trim() === '') {
    return `${fieldName} is required`
  }
  return null
}

export const validateAmount = (val, fieldName = 'Amount') => {
  const num = Number(val)
  if (isNaN(num) || num <= 0) {
    return `${fieldName} must be a valid number greater than 0`
  }
  return null
}

export const validateDate = (val, fieldName = 'Date') => {
  if (!val) return `${fieldName} is required`
  const d = new Date(val)
  if (isNaN(d.getTime())) return `Please enter a valid ${fieldName}`
  return null
}

export const validateInstallments = (total, paid) => {
  const tot = parseInt(total, 10)
  const pd = parseInt(paid, 10)
  if (isNaN(tot) || tot <= 0) return 'Total installments must be at least 1'
  if (isNaN(pd) || pd < 0) return 'Paid installments cannot be negative'
  if (pd > tot) return 'Paid installments cannot exceed total installments'
  return null
}
