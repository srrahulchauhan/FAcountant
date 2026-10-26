/**
 * Currency utilities for Indian Rupee (INR - ₹)
 */

export const formatINR = (amount, options = {}) => {
  const {
    showSymbol = true,
    showDecimals = false,
    useCompact = false
  } = options

  const num = Number(amount)
  if (isNaN(num)) return showSymbol ? '₹0' : '0'

  if (useCompact && Math.abs(num) >= 10000000) {
    // Crores
    const cr = (num / 10000000).toFixed(2)
    return `${showSymbol ? '₹' : ''}${parseFloat(cr)} Cr`
  }
  if (useCompact && Math.abs(num) >= 100000) {
    // Lakhs
    const lk = (num / 100000).toFixed(2)
    return `${showSymbol ? '₹' : ''}${parseFloat(lk)} L`
  }

  const formatter = new Intl.NumberFormat('en-IN', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })

  return formatter.format(num)
}

export const parseAmount = (value) => {
  if (typeof value === 'number') return isNaN(value) ? 0 : Math.max(0, value)
  if (!value) return 0
  const clean = String(value).replace(/[^0-9.-]+/g, '')
  const parsed = parseFloat(clean)
  return isNaN(parsed) ? 0 : Math.max(0, parsed)
}
