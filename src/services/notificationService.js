import { getDaysRemaining } from '../utils/dateUtils'
import { formatINR } from '../utils/currency'

/**
 * Generate notifications based on date rules and budget status
 */
export const generateNotifications = ({
  emiRecords = [],
  loans = [],
  rentRecords = [],
  expenses = [],
  budgets = {},
  categories = [],
  readNotificationIds = []
}) => {
  const notifications = []
  const todayStr = new Date().toISOString().split('T')[0]

  // 1. EMI Notifications
  emiRecords.forEach(emi => {
    const isFullyPaid = (parseInt(emi.paidInstallments, 10) || 0) >= (parseInt(emi.totalInstallments, 10) || 1)
    if (isFullyPaid || !emi.dueDate) return

    const days = getDaysRemaining(emi.dueDate)
    let title = ''
    let message = ''
    let level = 'info'

    if (days < 0) {
      title = 'Overdue EMI Payment'
      message = `EMI of ${formatINR(emi.monthlyEmiAmount)} for "${emi.emiName}" (${emi.bankName}) was due on ${emi.dueDate}. Please clear immediately.`
      level = 'danger'
    } else if (days === 0) {
      title = 'EMI Due Today'
      message = `EMI of ${formatINR(emi.monthlyEmiAmount)} for "${emi.emiName}" is due today!`
      level = 'warning'
    } else if (days === 1) {
      title = 'EMI Due Tomorrow'
      message = `EMI of ${formatINR(emi.monthlyEmiAmount)} for "${emi.emiName}" is due tomorrow.`
      level = 'warning'
    } else if (days === 2) {
      title = 'EMI Due in 2 Days'
      message = `Upcoming EMI payment of ${formatINR(emi.monthlyEmiAmount)} for "${emi.emiName}" in 2 days.`
      level = 'info'
    } else if (days === 3) {
      title = 'EMI Due in 3 Days'
      message = `Upcoming EMI payment of ${formatINR(emi.monthlyEmiAmount)} for "${emi.emiName}" in 3 days.`
      level = 'info'
    }

    if (title) {
      const id = `notif_emi_${emi.id}_${days <= 0 ? 'overdue' : days}`
      notifications.push({
        id,
        recordId: emi.id,
        recordType: 'emi',
        title,
        message,
        amount: emi.monthlyEmiAmount,
        dueDate: emi.dueDate,
        level,
        isRead: readNotificationIds.includes(id),
        createdAt: todayStr
      })
    }
  })

  // 2. Loan Repayment Notifications
  loans.forEach(loan => {
    const balance = Number(loan.outstandingBalance) || 0
    if (balance <= 0 || !loan.nextDueDate) return

    const days = getDaysRemaining(loan.nextDueDate)
    let title = ''
    let message = ''
    let level = 'info'

    if (days < 0) {
      title = 'Overdue Loan Payment'
      message = `Loan repayment of ${formatINR(loan.monthlyPaymentAmount)} for "${loan.loanName}" was due on ${loan.nextDueDate}.`
      level = 'danger'
    } else if (days <= 3) {
      title = 'Upcoming Loan Payment'
      message = `Payment of ${formatINR(loan.monthlyPaymentAmount)} for "${loan.loanName}" is due ${days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`}.`
      level = 'warning'
    }

    if (title) {
      const id = `notif_loan_${loan.id}_${days <= 0 ? 'overdue' : days}`
      notifications.push({
        id,
        recordId: loan.id,
        recordType: 'loan',
        title,
        message,
        amount: loan.monthlyPaymentAmount,
        dueDate: loan.nextDueDate,
        level,
        isRead: readNotificationIds.includes(id),
        createdAt: todayStr
      })
    }
  })

  // 3. Rent Notifications
  rentRecords.forEach(rent => {
    if (!rent.nextDueDate) return
    const days = getDaysRemaining(rent.nextDueDate)
    let title = ''
    let message = ''
    let level = 'info'

    if (days < 0) {
      title = 'Overdue Rent Payment'
      message = `Rent of ${formatINR(rent.monthlyRent)} for "${rent.propertyName}" was due on ${rent.nextDueDate}.`
      level = 'danger'
    } else if (days <= 3) {
      title = 'Upcoming Rent Payment'
      message = `Monthly rent of ${formatINR(rent.monthlyRent)} for "${rent.propertyName}" is due ${days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`}.`
      level = 'warning'
    }

    if (title) {
      const id = `notif_rent_${rent.id}_${days <= 0 ? 'overdue' : days}`
      notifications.push({
        id,
        recordId: rent.id,
        recordType: 'rent',
        title,
        message,
        amount: rent.monthlyRent,
        dueDate: rent.nextDueDate,
        level,
        isRead: readNotificationIds.includes(id),
        createdAt: todayStr
      })
    }
  })

  // 4. Budget Notifications
  const currentMonthKey = todayStr.slice(0, 7) // 'YYYY-MM'
  const monthlyExpenses = expenses
    .filter(e => (e.paymentStatus || 'Paid').toLowerCase() === 'paid' && e.date && e.date.startsWith(currentMonthKey))

  // Overall budget
  const overallLimit = Number(budgets.monthlyOverallBudget) || 0
  if (overallLimit > 0) {
    const totalSpent = monthlyExpenses.reduce((a, b) => a + (Number(b.amount) || 0), 0)
    const usage = (totalSpent / overallLimit) * 100

    if (usage >= 100) {
      const id = `notif_budget_overall_exceeded_${currentMonthKey}`
      notifications.push({
        id,
        recordId: 'overall',
        recordType: 'budget',
        title: 'Monthly Budget Exceeded',
        message: `Total spending (${formatINR(totalSpent)}) has exceeded your overall monthly budget of ${formatINR(overallLimit)} (${usage.toFixed(0)}%).`,
        amount: totalSpent,
        dueDate: todayStr,
        level: 'danger',
        isRead: readNotificationIds.includes(id),
        createdAt: todayStr
      })
    } else if (usage >= 80) {
      const id = `notif_budget_overall_80_${currentMonthKey}`
      notifications.push({
        id,
        recordId: 'overall',
        recordType: 'budget',
        title: 'Budget Approaching Limit (80%+)',
        message: `You have spent ${formatINR(totalSpent)} (${usage.toFixed(0)}%) of your ${formatINR(overallLimit)} overall monthly budget.`,
        amount: totalSpent,
        dueDate: todayStr,
        level: 'warning',
        isRead: readNotificationIds.includes(id),
        createdAt: todayStr
      })
    }
  }

  // Category budgets
  categories.forEach(cat => {
    const catBudget = Number(cat.monthlyBudget) || 0
    if (catBudget <= 0) return

    const spent = monthlyExpenses
      .filter(e => e.categoryName === cat.name)
      .reduce((a, b) => a + (Number(b.amount) || 0), 0)

    const usage = (spent / catBudget) * 100
    if (usage >= 100) {
      const id = `notif_budget_${cat.id}_exceeded_${currentMonthKey}`
      notifications.push({
        id,
        recordId: cat.id,
        recordType: 'budget',
        title: `Category Budget Exceeded: ${cat.name}`,
        message: `You spent ${formatINR(spent)} on "${cat.name}", exceeding the budget of ${formatINR(catBudget)}.`,
        amount: spent,
        dueDate: todayStr,
        level: 'danger',
        isRead: readNotificationIds.includes(id),
        createdAt: todayStr
      })
    } else if (usage >= 80) {
      const id = `notif_budget_${cat.id}_80_${currentMonthKey}`
      notifications.push({
        id,
        recordId: cat.id,
        recordType: 'budget',
        title: `Category Budget Warning: ${cat.name}`,
        message: `Spent ${formatINR(spent)} of ${formatINR(catBudget)} budget (${usage.toFixed(0)}%) for "${cat.name}".`,
        amount: spent,
        dueDate: todayStr,
        level: 'warning',
        isRead: readNotificationIds.includes(id),
        createdAt: todayStr
      })
    }
  })

  return notifications
}
