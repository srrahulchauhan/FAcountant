/**
 * Default Seed Data for FinTrack Personal Accountant
 * Uses realistic Indian financial context (INR, UPI, EMI, Rent, etc.)
 */

export const DEFAULT_SETTINGS = {
  currency: 'INR',
  currencySymbol: '₹',
  dateFormat: 'DD/MM/YYYY',
  theme: 'light',
  defaultPaymentMethod: 'UPI',
  remindersEnabled: true,
  reminderDaysBefore: 3,
  soundEnabled: false,
  appVersion: '2.4.0',
  profile: {
    name: 'Aakash Sharma',
    email: 'aakash.sharma@example.com',
    phone: '+91 98765 43210',
    occupation: 'Senior Software Engineer',
    city: 'Bengaluru'
  }
}

export const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Food & Groceries', icon: 'ShoppingCart', color: '#10b981', monthlyBudget: 18000, isDefault: true },
  { id: 'cat-2', name: 'Shopping', icon: 'ShoppingBag', color: '#ec4899', monthlyBudget: 12000, isDefault: true },
  { id: 'cat-3', name: 'Travel', icon: 'Plane', color: '#3b82f6', monthlyBudget: 8000, isDefault: true },
  { id: 'cat-4', name: 'Mobile Recharge', icon: 'Smartphone', color: '#8b5cf6', monthlyBudget: 1500, isDefault: true },
  { id: 'cat-5', name: 'Internet', icon: 'Wifi', color: '#06b6d4', monthlyBudget: 1200, isDefault: true },
  { id: 'cat-6', name: 'Electricity', icon: 'Zap', color: '#f59e0b', monthlyBudget: 3500, isDefault: true },
  { id: 'cat-7', name: 'Medical', icon: 'HeartPulse', color: '#ef4444', monthlyBudget: 6000, isDefault: true },
  { id: 'cat-8', name: 'Education', icon: 'GraduationCap', color: '#6366f1', monthlyBudget: 5000, isDefault: true },
  { id: 'cat-9', name: 'Entertainment', icon: 'Film', color: '#d946ef', monthlyBudget: 4000, isDefault: true },
  { id: 'cat-10', name: 'Personal Care', icon: 'Sparkles', color: '#14b8a6', monthlyBudget: 3000, isDefault: true },
  { id: 'cat-11', name: 'Rent', icon: 'Home', color: '#f97316', monthlyBudget: 28000, isDefault: true },
  { id: 'cat-12', name: 'Other', icon: 'MoreHorizontal', color: '#64748b', monthlyBudget: 5000, isDefault: true }
]

// Today's date helpers for seeding relative dates
const now = new Date()
const formatISO = (d) => d.toISOString().split('T')[0]
const addDays = (days) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return formatISO(d)
}
const subDays = (days) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return formatISO(d)
}

export const DEFAULT_INCOME = [
  {
    id: 'inc-1',
    title: 'Monthly Salary - TechCorp India',
    amount: 145000,
    date: subDays(1),
    source: 'TechCorp Solutions Pvt Ltd',
    paymentMethod: 'Bank Transfer',
    notes: 'Direct salary credit for October',
    createdAt: subDays(1)
  },
  {
    id: 'inc-2',
    title: 'Consulting & Freelance Web App',
    amount: 35000,
    date: subDays(8),
    source: 'Upwork Client',
    paymentMethod: 'Bank Transfer',
    notes: 'Frontend UI architecture milestone',
    createdAt: subDays(8)
  },
  {
    id: 'inc-3',
    title: 'Dividend Payout - Mutual Funds',
    amount: 6200,
    date: subDays(15),
    source: 'HDFC AMC',
    paymentMethod: 'Bank Transfer',
    notes: 'Quarterly dividend yield',
    createdAt: subDays(15)
  }
]

export const DEFAULT_EXPENSES = [
  {
    id: 'exp-1',
    title: 'Monthly Groceries & Essentials',
    amount: 4850,
    date: subDays(0), // Today
    categoryId: 'cat-1',
    categoryName: 'Food & Groceries',
    store: 'Blinkit Superstore',
    description: 'Weekly organic veggies, milk, fruits, and dry rations',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    receiptImage: null,
    createdAt: subDays(0)
  },
  {
    id: 'exp-2',
    title: 'Fuel & Highway Fastag',
    amount: 2200,
    date: subDays(0), // Today
    categoryId: 'cat-3',
    categoryName: 'Travel',
    store: 'Indian Oil Petrol Pump',
    description: 'Fuel top-up & Fastag recharge',
    paymentMethod: 'Google Pay',
    paymentStatus: 'Paid',
    receiptImage: null,
    createdAt: subDays(0)
  },
  {
    id: 'exp-3',
    title: 'Dinner with Family',
    amount: 3400,
    date: subDays(2),
    categoryId: 'cat-1',
    categoryName: 'Food & Groceries',
    store: 'Barbeque Nation',
    description: 'Weekend dinner buffet',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    receiptImage: null,
    createdAt: subDays(2)
  },
  {
    id: 'exp-4',
    title: 'Airtel Fiber Broadband Bill',
    amount: 1179,
    date: subDays(3),
    categoryId: 'cat-5',
    categoryName: 'Internet',
    store: 'Airtel Payments',
    description: '200 Mbps unlimited plan',
    paymentMethod: 'PhonePe',
    paymentStatus: 'Paid',
    receiptImage: null,
    createdAt: subDays(3)
  },
  {
    id: 'exp-5',
    title: 'BESCOM Electricity Bill',
    amount: 2650,
    date: subDays(5),
    categoryId: 'cat-6',
    categoryName: 'Electricity',
    store: 'BESCOM Portal',
    description: 'September billing cycle electricity',
    paymentMethod: 'Paytm',
    paymentStatus: 'Paid',
    receiptImage: null,
    createdAt: subDays(5)
  },
  {
    id: 'exp-6',
    title: 'Nike Running Shoes',
    amount: 5499,
    date: subDays(7),
    categoryId: 'cat-2',
    categoryName: 'Shopping',
    store: 'Nike Indiranagar Store',
    description: 'Pegasus 40 running shoes',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    receiptImage: null,
    createdAt: subDays(7)
  },
  {
    id: 'exp-7',
    title: 'Full Body Health Checkup',
    amount: 2499,
    date: subDays(10),
    categoryId: 'cat-7',
    categoryName: 'Medical',
    store: 'Apollo Diagnostics',
    description: 'Annual comprehensive preventive health check',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    receiptImage: null,
    createdAt: subDays(10)
  },
  {
    id: 'exp-8',
    title: 'Movie Tickets & Snacks (IMAX)',
    amount: 1450,
    date: subDays(12),
    categoryId: 'cat-9',
    categoryName: 'Entertainment',
    store: 'PVR Cinemas Forum Mall',
    description: '2 IMAX tickets + popcorn combo',
    paymentMethod: 'Google Pay',
    paymentStatus: 'Paid',
    receiptImage: null,
    createdAt: subDays(12)
  },
  {
    id: 'exp-9',
    title: 'Jio 5G Annual Plan Recharge',
    amount: 2999,
    date: subDays(18),
    categoryId: 'cat-4',
    categoryName: 'Mobile Recharge',
    store: 'MyJio App',
    description: '365 days 2.5GB/day plan',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    receiptImage: null,
    createdAt: subDays(18)
  },
  {
    id: 'exp-10',
    title: 'Software Design Architecture Course',
    amount: 3200,
    date: subDays(20),
    categoryId: 'cat-8',
    categoryName: 'Education',
    store: 'Coursera / Deeplearning',
    description: 'Advanced Cloud Architect Specialization',
    paymentMethod: 'Debit Card',
    paymentStatus: 'Paid',
    receiptImage: null,
    createdAt: subDays(20)
  }
]

export const DEFAULT_EMI_RECORDS = [
  {
    id: 'emi-1',
    emiName: 'Tata Nexon EV Car Loan',
    bankName: 'HDFC Bank',
    originalLoanAmount: 1200000,
    monthlyEmiAmount: 24500,
    interestRate: 8.75,
    startDate: subDays(365),
    dueDate: addDays(2), // Due in 2 days!
    totalInstallments: 60,
    paidInstallments: 12,
    paymentFrequency: 'Monthly',
    paymentMethod: 'Bank Transfer',
    status: 'Due Soon',
    notes: 'Auto-debit setup on salary account',
    createdAt: subDays(365)
  },
  {
    id: 'emi-2',
    emiName: 'Apple MacBook Pro M3 Max',
    bankName: 'ICICI Bank Credit Card No-Cost EMI',
    originalLoanAmount: 189900,
    monthlyEmiAmount: 15825,
    interestRate: 0,
    startDate: subDays(180),
    dueDate: addDays(6), // Upcoming
    totalInstallments: 12,
    paidInstallments: 6,
    paymentFrequency: 'Monthly',
    paymentMethod: 'Credit Card',
    status: 'Pending',
    notes: '6 installments completed smoothly',
    createdAt: subDays(180)
  }
]

export const DEFAULT_EMI_PAYMENTS = [
  {
    id: 'emip-1',
    emiId: 'emi-1',
    emiName: 'Tata Nexon EV Car Loan',
    paymentType: 'Full',
    amountPaid: 24500,
    paymentDate: subDays(28),
    transactionRef: 'HDFC9482910482',
    paymentStatus: 'Paid',
    installmentNumber: 12,
    notes: 'October monthly installment deducted',
    createdAt: subDays(28)
  },
  {
    id: 'emip-2',
    emiId: 'emi-2',
    emiName: 'Apple MacBook Pro M3 Max',
    paymentType: 'Full',
    amountPaid: 15825,
    paymentDate: subDays(24),
    transactionRef: 'ICICI837190391',
    paymentStatus: 'Paid',
    installmentNumber: 6,
    notes: 'Installment #6 paid via credit card',
    createdAt: subDays(24)
  }
]

export const DEFAULT_LOANS = [
  {
    id: 'loan-1',
    loanName: 'SBI Home Improvement Personal Loan',
    bankName: 'State Bank of India',
    loanType: 'Personal Loan',
    originalLoanAmount: 400000,
    interestRate: 11.2,
    startDate: subDays(240),
    endDate: addDays(480),
    monthlyPaymentAmount: 15000,
    nextDueDate: addDays(5),
    totalRepaid: 120000,
    outstandingBalance: 280000,
    paymentFrequency: 'Monthly',
    paymentMethod: 'Bank Transfer',
    status: 'Active',
    notes: 'Pre-payment allowed with zero penalty',
    createdAt: subDays(240)
  }
]

export const DEFAULT_LOAN_PAYMENTS = [
  {
    id: 'loanp-1',
    loanId: 'loan-1',
    loanName: 'SBI Home Improvement Personal Loan',
    paymentType: 'Full',
    amountPaid: 15000,
    paymentDate: subDays(25),
    transactionRef: 'SBIN002938192',
    paymentStatus: 'Paid',
    notes: 'Repayment for September',
    createdAt: subDays(25)
  }
]

export const DEFAULT_RENT_RECORDS = [
  {
    id: 'rent-1',
    propertyName: 'Palm Grove Apartments 302',
    roomPgName: '2BHK Luxury Unit',
    landlordName: 'Col. Rajesh Verma',
    landlordContact: '+91 94480 12345',
    monthlyRent: 26000,
    securityDeposit: 100000,
    agreementStartDate: subDays(150),
    agreementEndDate: addDays(215),
    monthlyDueDay: 5,
    nextDueDate: addDays(3), // Due in 3 days!
    paymentMethod: 'UPI',
    status: 'Due Soon',
    notes: 'Includes maintenance charges. Water bill paid separately.',
    createdAt: subDays(150)
  }
]

export const DEFAULT_RENT_PAYMENTS = [
  {
    id: 'rentp-1',
    rentId: 'rent-1',
    propertyName: 'Palm Grove Apartments 302',
    paymentType: 'Monthly Rent',
    amountPaid: 26000,
    paymentDate: subDays(27),
    transactionRef: 'UPI202610018471',
    paymentStatus: 'Paid',
    rentForMonth: 'September 2026',
    notes: 'Rent transferred via GPay to landlord',
    createdAt: subDays(27)
  }
]

export const DEFAULT_BUDGETS = {
  monthlyOverallBudget: 95000,
  categoryBudgets: {
    'Food & Groceries': 18000,
    'Shopping': 12000,
    'Travel': 8000,
    'Electricity': 3500,
    'Medical': 6000,
    'Entertainment': 4000
  }
}
