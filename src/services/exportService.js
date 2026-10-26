import * as XLSX from 'xlsx'
import { formatDate } from '../utils/dateUtils'
import { calculateFinancialSummary } from '../utils/calculations'

/**
 * Generate full consolidated Excel Workbook with 12 worksheets
 */
export const exportFullExcelWorkbook = ({
  income = [],
  expenses = [],
  categories = [],
  emiRecords = [],
  emiPayments = [],
  loans = [],
  loanPayments = [],
  rentRecords = [],
  rentPayments = [],
  budgets = {},
  settings = {}
}) => {
  const wb = XLSX.utils.book_new()
  const summary = calculateFinancialSummary({
    income,
    expenses,
    emiRecords,
    emiPayments,
    loans,
    loanPayments,
    rentRecords,
    rentPayments
  })

  // 1. Dashboard Summary
  const summarySheetData = [
    { Metric: 'Report Generated Date', Value: new Date().toLocaleString() },
    { Metric: 'User Profile Name', Value: settings.profile?.name || 'Aakash Sharma' },
    { Metric: 'Currency', Value: 'INR (₹)' },
    { Metric: 'Total Available Balance (₹)', Value: summary.totalAvailableBalance },
    { Metric: 'Total Income (₹)', Value: summary.totalIncome },
    { Metric: 'Today\'s Expenses (₹)', Value: summary.todayExpenses },
    { Metric: 'Monthly Expenses (₹)', Value: summary.monthlyExpenses },
    { Metric: 'Total EMI Paid (₹)', Value: summary.totalEmiPaid },
    { Metric: 'Outstanding Loans (₹)', Value: summary.outstandingLoans },
    { Metric: 'Monthly Rent Obligation (₹)', Value: summary.monthlyRent },
    { Metric: 'Upcoming Payments Count', Value: summary.upcomingPayments.count },
    { Metric: 'Upcoming Payments Amount (₹)', Value: summary.upcomingPayments.amount },
    { Metric: 'Pending Payments Count', Value: summary.pendingPayments.count },
    { Metric: 'Pending Payments Amount (₹)', Value: summary.pendingPayments.amount },
    { Metric: 'Overdue Payments Count', Value: summary.overduePayments.count },
    { Metric: 'Overdue Payments Amount (₹)', Value: summary.overduePayments.amount },
  ]
  const wsSummary = XLSX.utils.json_to_sheet(summarySheetData)
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Dashboard Summary')

  // 2. Daily Expenses
  const expensesData = expenses.map(e => ({
    'ID': e.id,
    'Title': e.title,
    'Amount (₹)': Number(e.amount),
    'Date': formatDate(e.date),
    'Category': e.categoryName,
    'Store/Shop': e.store || '-',
    'Payment Method': e.paymentMethod,
    'Status': e.paymentStatus || 'Paid',
    'Description': e.description || ''
  }))
  const wsExpenses = XLSX.utils.json_to_sheet(expensesData.length ? expensesData : [{ Notice: 'No daily expense records' }])
  XLSX.utils.book_append_sheet(wb, wsExpenses, 'Daily Expenses')

  // 3. Categories
  const categoriesData = categories.map(c => ({
    'ID': c.id,
    'Category Name': c.name,
    'Monthly Budget (₹)': Number(c.monthlyBudget) || 0,
    'Color': c.color || '',
    'Icon': c.icon || ''
  }))
  const wsCategories = XLSX.utils.json_to_sheet(categoriesData)
  XLSX.utils.book_append_sheet(wb, wsCategories, 'Categories')

  // 4. EMI Records
  const emiRecData = emiRecords.map(r => ({
    'ID': r.id,
    'EMI Name': r.emiName,
    'Bank/Lender': r.bankName,
    'Original Loan Amount (₹)': Number(r.originalLoanAmount),
    'Monthly EMI (₹)': Number(r.monthlyEmiAmount),
    'Interest Rate (%)': Number(r.interestRate),
    'Start Date': formatDate(r.startDate),
    'Next Due Date': formatDate(r.dueDate),
    'Total Installments': Number(r.totalInstallments),
    'Paid Installments': Number(r.paidInstallments),
    'Status': r.status,
    'Payment Method': r.paymentMethod,
    'Notes': r.notes || ''
  }))
  const wsEmiRec = XLSX.utils.json_to_sheet(emiRecData.length ? emiRecData : [{ Notice: 'No EMI records' }])
  XLSX.utils.book_append_sheet(wb, wsEmiRec, 'EMI Records')

  // 5. EMI Payments
  const emiPayData = emiPayments.map(p => ({
    'Payment ID': p.id,
    'EMI Record ID': p.emiId,
    'EMI Name': p.emiName,
    'Payment Type': p.paymentType,
    'Amount Paid (₹)': Number(p.amountPaid),
    'Payment Date': formatDate(p.paymentDate),
    'Transaction Ref': p.transactionRef || '-',
    'Installment Number': p.installmentNumber || '-',
    'Notes': p.notes || ''
  }))
  const wsEmiPay = XLSX.utils.json_to_sheet(emiPayData.length ? emiPayData : [{ Notice: 'No EMI payments recorded' }])
  XLSX.utils.book_append_sheet(wb, wsEmiPay, 'EMI Payments')

  // 6. Loan Records
  const loanRecData = loans.map(l => ({
    'ID': l.id,
    'Loan Name': l.loanName,
    'Lender/Bank': l.bankName,
    'Type': l.loanType || 'Personal Loan',
    'Original Amount (₹)': Number(l.originalLoanAmount),
    'Interest Rate (%)': Number(l.interestRate),
    'Start Date': formatDate(l.startDate),
    'End Date': formatDate(l.endDate),
    'Monthly Payment (₹)': Number(l.monthlyPaymentAmount),
    'Next Due Date': formatDate(l.nextDueDate),
    'Total Repaid (₹)': Number(l.totalRepaid),
    'Outstanding Balance (₹)': Number(l.outstandingBalance),
    'Status': l.status,
    'Notes': l.notes || ''
  }))
  const wsLoanRec = XLSX.utils.json_to_sheet(loanRecData.length ? loanRecData : [{ Notice: 'No loan records' }])
  XLSX.utils.book_append_sheet(wb, wsLoanRec, 'Loan Records')

  // 7. Loan Payments
  const loanPayData = loanPayments.map(p => ({
    'Payment ID': p.id,
    'Loan ID': p.loanId,
    'Loan Name': p.loanName,
    'Payment Type': p.paymentType,
    'Amount Paid (₹)': Number(p.amountPaid),
    'Payment Date': formatDate(p.paymentDate),
    'Transaction Ref': p.transactionRef || '-',
    'Notes': p.notes || ''
  }))
  const wsLoanPay = XLSX.utils.json_to_sheet(loanPayData.length ? loanPayData : [{ Notice: 'No loan payments recorded' }])
  XLSX.utils.book_append_sheet(wb, wsLoanPay, 'Loan Payments')

  // 8. Rent Records
  const rentRecData = rentRecords.map(r => ({
    'ID': r.id,
    'Property Name': r.propertyName,
    'Room/PG': r.roomPgName || '',
    'Landlord': r.landlordName,
    'Contact': r.landlordContact || '-',
    'Monthly Rent (₹)': Number(r.monthlyRent),
    'Security Deposit (₹)': Number(r.securityDeposit),
    'Agreement Start': formatDate(r.agreementStartDate),
    'Agreement End': formatDate(r.agreementEndDate),
    'Next Due Date': formatDate(r.nextDueDate),
    'Payment Method': r.paymentMethod,
    'Status': r.status,
    'Notes': r.notes || ''
  }))
  const wsRentRec = XLSX.utils.json_to_sheet(rentRecData.length ? rentRecData : [{ Notice: 'No rent records' }])
  XLSX.utils.book_append_sheet(wb, wsRentRec, 'Rent Records')

  // 9. Rent Payments
  const rentPayData = rentPayments.map(p => ({
    'Payment ID': p.id,
    'Rent ID': p.rentId,
    'Property Name': p.propertyName,
    'Payment Type': p.paymentType,
    'Amount Paid (₹)': Number(p.amountPaid),
    'Payment Date': formatDate(p.paymentDate),
    'Month For': p.rentForMonth || '-',
    'Transaction Ref': p.transactionRef || '-',
    'Notes': p.notes || ''
  }))
  const wsRentPay = XLSX.utils.json_to_sheet(rentPayData.length ? rentPayData : [{ Notice: 'No rent payments recorded' }])
  XLSX.utils.book_append_sheet(wb, wsRentPay, 'Rent Payments')

  // 10. All Transactions
  const unifiedTx = []
  income.forEach(inc => {
    unifiedTx.push({
      'Type': 'Income',
      'Title': inc.title,
      'Amount (₹)': Number(inc.amount),
      'Date': formatDate(inc.date),
      'Category/Source': inc.source || 'Income',
      'Payment Method': inc.paymentMethod,
      'Status': 'Received',
      'Reference': inc.id
    })
  })
  expenses.forEach(exp => {
    unifiedTx.push({
      'Type': 'Daily Expense',
      'Title': exp.title,
      'Amount (₹)': Number(exp.amount),
      'Date': formatDate(exp.date),
      'Category/Source': exp.categoryName,
      'Payment Method': exp.paymentMethod,
      'Status': exp.paymentStatus || 'Paid',
      'Reference': exp.id
    })
  })
  emiPayments.forEach(p => {
    unifiedTx.push({
      'Type': 'EMI Payment',
      'Title': `EMI: ${p.emiName}`,
      'Amount (₹)': Number(p.amountPaid),
      'Date': formatDate(p.paymentDate),
      'Category/Source': 'EMI Payment',
      'Payment Method': p.paymentMethod || 'Bank Transfer',
      'Status': 'Paid',
      'Reference': p.id
    })
  })
  loanPayments.forEach(p => {
    unifiedTx.push({
      'Type': 'Loan Repayment',
      'Title': `Loan: ${p.loanName}`,
      'Amount (₹)': Number(p.amountPaid),
      'Date': formatDate(p.paymentDate),
      'Category/Source': 'Loan Repayment',
      'Payment Method': p.paymentMethod || 'Bank Transfer',
      'Status': 'Paid',
      'Reference': p.id
    })
  })
  rentPayments.forEach(p => {
    unifiedTx.push({
      'Type': 'Rent Payment',
      'Title': `Rent: ${p.propertyName} (${p.paymentType})`,
      'Amount (₹)': Number(p.amountPaid),
      'Date': formatDate(p.paymentDate),
      'Category/Source': 'Rent & PG',
      'Payment Method': p.paymentMethod || 'UPI',
      'Status': 'Paid',
      'Reference': p.id
    })
  })
  const wsAllTx = XLSX.utils.json_to_sheet(unifiedTx.length ? unifiedTx : [{ Notice: 'No transactions' }])
  XLSX.utils.book_append_sheet(wb, wsAllTx, 'All Transactions')

  // 11. Budgets
  const budgetRows = [
    { Category: 'Overall Monthly Budget', 'Allocated Budget (₹)': Number(budgets.monthlyOverallBudget) || 0 }
  ]
  if (budgets.categoryBudgets) {
    Object.entries(budgets.categoryBudgets).forEach(([cat, amount]) => {
      budgetRows.push({
        Category: cat,
        'Allocated Budget (₹)': Number(amount)
      })
    })
  }
  const wsBudgets = XLSX.utils.json_to_sheet(budgetRows)
  XLSX.utils.book_append_sheet(wb, wsBudgets, 'Budgets')

  // 12. Settings
  const settingsRows = [
    { Setting: 'Currency', Value: settings.currency || 'INR' },
    { Setting: 'Default Payment Method', Value: settings.defaultPaymentMethod || 'UPI' },
    { Setting: 'Reminders Enabled', Value: settings.remindersEnabled ? 'Yes' : 'No' },
    { Setting: 'Reminder Days Before', Value: settings.reminderDaysBefore || 3 },
    { Setting: 'Profile Name', Value: settings.profile?.name || '' },
    { Setting: 'Profile Email', Value: settings.profile?.email || '' },
    { Setting: 'Profile Phone', Value: settings.profile?.phone || '' },
    { Setting: 'App Version', Value: settings.appVersion || '2.4.0' }
  ]
  const wsSettings = XLSX.utils.json_to_sheet(settingsRows)
  XLSX.utils.book_append_sheet(wb, wsSettings, 'Settings')

  // Save Workbook
  const dateStr = new Date().toISOString().split('T')[0]
  XLSX.writeFile(wb, `FinTrack_Complete_Financial_Report_${dateStr}.xlsx`)
}

/**
 * Export generic tabular data to Excel
 */
export const exportTableToExcel = (data, fileName = 'Report_Export', sheetName = 'Report') => {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(data.length ? data : [{ Notice: 'No records found' }])
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`)
}
