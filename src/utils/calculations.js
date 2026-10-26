import {
  isDateToday,
  isDateInCurrentMonth,
  isDateInCurrentWeek,
  isDateInCurrentYear,
  getPaymentUrgency,
  formatMonthYear,
  parseSafeDate
} from './dateUtils'
import { subMonths, format } from 'date-fns'

/**
 * Core Financial Calculation Engine
 */

export const calculateFinancialSummary = ({
  income = [],
  expenses = [],
  emiRecords = [],
  emiPayments = [],
  loans = [],
  loanPayments = [],
  rentRecords = [],
  rentPayments = []
}) => {
  // 1. Total Income
  const totalIncome = income.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)

  // 2. Completed Expenses
  // A. Regular Daily Expenses (Only those marked 'Paid')
  const paidDailyExpenses = expenses.filter(e => (e.paymentStatus || 'Paid').toLowerCase() === 'paid')
  const totalDailyExpensesAmount = paidDailyExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)

  // B. Recorded EMI payments
  const totalEmiPaymentsAmount = emiPayments.reduce((acc, curr) => acc + (Number(curr.amountPaid) || 0), 0)

  // C. Recorded Loan repayments (excluding any linked to EMI to prevent duplicate counting)
  const totalLoanRepaymentsAmount = loanPayments.reduce((acc, curr) => acc + (Number(curr.amountPaid) || 0), 0)

  // D. Recorded Rent payments (Monthly Rent / Advance Rent / Partial; separate security deposit from operating expenses)
  const totalRentExpensesAmount = rentPayments
    .filter(p => p.paymentType !== 'Security Deposit')
    .reduce((acc, curr) => acc + (Number(curr.amountPaid) || 0), 0)

  // Consolidated Completed Expenses
  const totalExpenses = totalDailyExpensesAmount + totalEmiPaymentsAmount + totalLoanRepaymentsAmount + totalRentExpensesAmount

  // Total Available Balance
  const totalAvailableBalance = totalIncome - totalExpenses

  // 3. Today's Expenses (Expenses paid today + payments made today)
  const todayDaily = paidDailyExpenses.filter(e => isDateToday(e.date)).reduce((a, b) => a + Number(b.amount || 0), 0)
  const todayEmi = emiPayments.filter(p => isDateToday(p.paymentDate)).reduce((a, b) => a + Number(b.amountPaid || 0), 0)
  const todayLoan = loanPayments.filter(p => isDateToday(p.paymentDate)).reduce((a, b) => a + Number(b.amountPaid || 0), 0)
  const todayRent = rentPayments.filter(p => isDateToday(p.paymentDate) && p.paymentType !== 'Security Deposit').reduce((a, b) => a + Number(b.amountPaid || 0), 0)
  const todayExpenses = todayDaily + todayEmi + todayLoan + todayRent

  // 4. Monthly Expenses (Current Calendar Month)
  const monthlyDaily = paidDailyExpenses.filter(e => isDateInCurrentMonth(e.date)).reduce((a, b) => a + Number(b.amount || 0), 0)
  const monthlyEmi = emiPayments.filter(p => isDateInCurrentMonth(p.paymentDate)).reduce((a, b) => a + Number(b.amountPaid || 0), 0)
  const monthlyLoan = loanPayments.filter(p => isDateInCurrentMonth(p.paymentDate)).reduce((a, b) => a + Number(b.amountPaid || 0), 0)
  const monthlyRentExpense = rentPayments.filter(p => isDateInCurrentMonth(p.paymentDate) && p.paymentType !== 'Security Deposit').reduce((a, b) => a + Number(b.amountPaid || 0), 0)
  const monthlyExpenses = monthlyDaily + monthlyEmi + monthlyLoan + monthlyRentExpense

  // 5. Total EMI Paid
  const totalEmiPaid = totalEmiPaymentsAmount

  // 6. Outstanding Loans (Sum of outstanding balance from all loan records)
  const outstandingLoans = loans.reduce((acc, loan) => {
    // outstandingBalance is either stored directly or computed: (originalLoanAmount - totalRepaid)
    const original = Number(loan.originalLoanAmount) || 0
    const repaid = Number(loan.totalRepaid) || 0
    const balance = loan.outstandingBalance !== undefined ? Number(loan.outstandingBalance) : Math.max(0, original - repaid)
    return acc + Math.max(0, balance)
  }, 0)

  // 7. Monthly Rent Obligation (Sum of monthly rent across active rent agreements)
  const monthlyRent = rentRecords.reduce((acc, rent) => acc + (Number(rent.monthlyRent) || 0), 0)

  // 8, 9, 10. Obligations: Upcoming, Pending, and Overdue calculations
  let upcomingCount = 0
  let upcomingAmount = 0
  let pendingCount = 0
  let pendingAmount = 0
  let overdueCount = 0
  let overdueAmount = 0

  const allReminders = []

  // Check EMI Records status
  emiRecords.forEach(emi => {
    const isFullyPaid = (parseInt(emi.paidInstallments, 10) || 0) >= (parseInt(emi.totalInstallments, 10) || 1)
    if (isFullyPaid) return

    const urgency = getPaymentUrgency(emi.dueDate, false)
    const amount = Number(emi.monthlyEmiAmount) || 0

    const reminder = {
      id: `emi-${emi.id}`,
      type: 'EMI',
      title: emi.emiName,
      subtitle: emi.bankName,
      amount,
      dueDate: emi.dueDate,
      urgency,
      recordId: emi.id
    }
    allReminders.push(reminder)

    if (urgency === 'overdue') {
      overdueCount++
      overdueAmount += amount
    } else if (urgency === 'due-today' || urgency === 'due-tomorrow' || urgency === 'due-soon') {
      upcomingCount++
      upcomingAmount += amount
      pendingCount++
      pendingAmount += amount
    } else {
      pendingCount++
      pendingAmount += amount
    }
  })

  // Check Loans next due
  loans.forEach(loan => {
    const balance = Number(loan.outstandingBalance) || 0
    if (balance <= 0 || !loan.nextDueDate) return

    const urgency = getPaymentUrgency(loan.nextDueDate, false)
    const amount = Number(loan.monthlyPaymentAmount) || 0

    const reminder = {
      id: `loan-${loan.id}`,
      type: 'Loan',
      title: loan.loanName,
      subtitle: loan.bankName,
      amount,
      dueDate: loan.nextDueDate,
      urgency,
      recordId: loan.id
    }
    allReminders.push(reminder)

    if (urgency === 'overdue') {
      overdueCount++
      overdueAmount += amount
    } else if (urgency === 'due-today' || urgency === 'due-tomorrow' || urgency === 'due-soon') {
      upcomingCount++
      upcomingAmount += amount
      pendingCount++
      pendingAmount += amount
    }
  })

  // Check Rent records
  rentRecords.forEach(rent => {
    if (!rent.nextDueDate) return
    const urgency = getPaymentUrgency(rent.nextDueDate, false)
    const amount = Number(rent.monthlyRent) || 0

    const reminder = {
      id: `rent-${rent.id}`,
      type: 'Rent',
      title: rent.propertyName,
      subtitle: rent.roomPgName || rent.landlordName,
      amount,
      dueDate: rent.nextDueDate,
      urgency,
      recordId: rent.id
    }
    allReminders.push(reminder)

    if (urgency === 'overdue') {
      overdueCount++
      overdueAmount += amount
    } else if (urgency === 'due-today' || urgency === 'due-tomorrow' || urgency === 'due-soon') {
      upcomingCount++
      upcomingAmount += amount
      pendingCount++
      pendingAmount += amount
    }
  })

  // Check any Pending daily expenses
  expenses.filter(e => (e.paymentStatus || '').toLowerCase() === 'pending').forEach(exp => {
    pendingCount++
    pendingAmount += Number(exp.amount) || 0
  })

  return {
    totalAvailableBalance,
    totalIncome,
    totalExpenses,
    todayExpenses,
    monthlyExpenses,
    totalEmiPaid,
    outstandingLoans,
    monthlyRent,
    upcomingPayments: { count: upcomingCount, amount: upcomingAmount },
    pendingPayments: { count: pendingCount, amount: pendingAmount },
    overduePayments: { count: overdueCount, amount: overdueAmount },
    reminders: allReminders.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  }
}

/**
 * Generate 6-month monthly trend for Income vs Expenses
 */
export const getMonthlyTrendData = ({
  income = [],
  expenses = [],
  emiPayments = [],
  loanPayments = [],
  rentPayments = []
}, monthsCount = 6) => {
  const result = []
  const now = new Date()

  for (let i = monthsCount - 1; i >= 0; i--) {
    const targetDate = subMonths(now, i)
    const monthKey = format(targetDate, 'yyyy-MM')
    const displayLabel = format(targetDate, 'MMM yyyy')

    const monthIncome = income
      .filter(item => item.date && item.date.startsWith(monthKey))
      .reduce((a, b) => a + (Number(b.amount) || 0), 0)

    const paidDaily = expenses
      .filter(item => (item.paymentStatus || 'Paid').toLowerCase() === 'paid' && item.date && item.date.startsWith(monthKey))
      .reduce((a, b) => a + (Number(b.amount) || 0), 0)

    const monthEmi = emiPayments
      .filter(item => item.paymentDate && item.paymentDate.startsWith(monthKey))
      .reduce((a, b) => a + (Number(b.amountPaid) || 0), 0)

    const monthLoan = loanPayments
      .filter(item => item.paymentDate && item.paymentDate.startsWith(monthKey))
      .reduce((a, b) => a + (Number(b.amountPaid) || 0), 0)

    const monthRent = rentPayments
      .filter(item => item.paymentType !== 'Security Deposit' && item.paymentDate && item.paymentDate.startsWith(monthKey))
      .reduce((a, b) => a + (Number(b.amountPaid) || 0), 0)

    const totalMonthExpenses = paidDaily + monthEmi + monthLoan + monthRent

    result.push({
      month: displayLabel,
      monthKey,
      income: monthIncome,
      expenses: totalMonthExpenses,
      savings: monthIncome - totalMonthExpenses
    })
  }

  return result
}

/**
 * Category-wise expense breakdown
 */
export const getCategoryBreakdown = ({
  expenses = [],
  categories = []
}) => {
  const paidExpenses = expenses.filter(e => (e.paymentStatus || 'Paid').toLowerCase() === 'paid')
  const total = paidExpenses.reduce((a, b) => a + (Number(b.amount) || 0), 0)

  const catMap = {}
  categories.forEach(cat => {
    catMap[cat.name] = {
      name: cat.name,
      color: cat.color || '#6366f1',
      icon: cat.icon || 'Tag',
      budget: Number(cat.monthlyBudget) || 0,
      amount: 0
    }
  })

  paidExpenses.forEach(exp => {
    const catName = exp.categoryName || 'Other'
    if (!catMap[catName]) {
      catMap[catName] = {
        name: catName,
        color: '#94a3b8',
        icon: 'Tag',
        budget: 0,
        amount: 0
      }
    }
    catMap[catName].amount += Number(exp.amount) || 0
  })

  return Object.values(catMap)
    .filter(c => c.amount > 0 || c.budget > 0)
    .map(c => ({
      ...c,
      percentage: total > 0 ? ((c.amount / total) * 100).toFixed(1) : 0
    }))
    .sort((a, b) => b.amount - a.amount)
}
