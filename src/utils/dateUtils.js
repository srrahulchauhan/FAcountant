import {
  format,
  parseISO,
  isValid,
  isToday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  differenceInCalendarDays,
  addMonths,
  setMonth,
  setYear,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  isBefore,
  isAfter,
  startOfDay,
} from 'date-fns'

export const parseSafeDate = (dateVal) => {
  if (!dateVal) return new Date()
  if (dateVal instanceof Date) return isValid(dateVal) ? dateVal : new Date()
  const parsed = parseISO(dateVal)
  if (isValid(parsed)) return parsed
  const fallback = new Date(dateVal)
  return isValid(fallback) ? fallback : new Date()
}

export const formatDate = (dateVal, formatStr = 'dd/MM/yyyy') => {
  try {
    const d = parseSafeDate(dateVal)
    return format(d, formatStr)
  } catch {
    return String(dateVal || '')
  }
}

export const formatInputDate = (dateVal) => {
  try {
    const d = parseSafeDate(dateVal)
    return format(d, 'yyyy-MM-dd')
  } catch {
    return ''
  }
}

export const formatMonthYear = (dateVal) => {
  try {
    const d = parseSafeDate(dateVal)
    return format(d, 'MMM yyyy')
  } catch {
    return ''
  }
}

export const getDaysRemaining = (dueDateVal) => {
  if (!dueDateVal) return 0
  const due = startOfDay(parseSafeDate(dueDateVal))
  const today = startOfDay(new Date())
  return differenceInCalendarDays(due, today)
}

/**
 * Returns:
 * 'paid'
 * 'overdue' (days < 0)
 * 'due-today' (days === 0)
 * 'due-tomorrow' (days === 1)
 * 'due-soon' (days 2 or 3)
 * 'upcoming' (days > 3)
 */
export const getPaymentUrgency = (dueDateVal, isPaid = false) => {
  if (isPaid) return 'paid'
  const diff = getDaysRemaining(dueDateVal)
  if (diff < 0) return 'overdue'
  if (diff === 0) return 'due-today'
  if (diff === 1) return 'due-tomorrow'
  if (diff <= 3) return 'due-soon'
  return 'upcoming'
}

export const getNextMonthlyDueDate = (currentDueDateVal, preferredDay = null) => {
  const current = parseSafeDate(currentDueDateVal)
  const nextMonth = addMonths(current, 1)
  if (preferredDay && preferredDay >= 1 && preferredDay <= 31) {
    const d = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), preferredDay)
    return format(d, 'yyyy-MM-dd')
  }
  return format(nextMonth, 'yyyy-MM-dd')
}

export const isDateToday = (dateVal) => {
  return isToday(parseSafeDate(dateVal))
}

export const isDateInCurrentWeek = (dateVal) => {
  return isThisWeek(parseSafeDate(dateVal), { weekStartsOn: 1 })
}

export const isDateInCurrentMonth = (dateVal) => {
  return isThisMonth(parseSafeDate(dateVal))
}

export const isDateInCurrentYear = (dateVal) => {
  return isThisYear(parseSafeDate(dateVal))
}

export const isDateInRange = (dateVal, startDate, endDate) => {
  const d = startOfDay(parseSafeDate(dateVal))
  const start = startDate ? startOfDay(parseSafeDate(startDate)) : null
  const end = endDate ? startOfDay(parseSafeDate(endDate)) : null

  if (start && end) {
    return (isAfter(d, start) || d.getTime() === start.getTime()) &&
           (isBefore(d, end) || d.getTime() === end.getTime())
  }
  if (start) return isAfter(d, start) || d.getTime() === start.getTime()
  if (end) return isBefore(d, end) || d.getTime() === end.getTime()
  return true
}

export {
  isToday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
}
