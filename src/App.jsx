import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { FinancialProvider } from './context/FinancialContext'
import { ThemeProvider } from './context/ThemeContext'
import { MainLayout } from './components/layout/MainLayout'

// Pages
import { Dashboard } from './pages/Dashboard'
import { Expenses } from './pages/Expenses'
import { Categories } from './pages/Categories'
import { EMIManagement } from './pages/EMIManagement'
import { LoanManagement } from './pages/LoanManagement'
import { RentManagement } from './pages/RentManagement'
import { Transactions } from './pages/Transactions'
import { Budgets } from './pages/Budgets'
import { Reports } from './pages/Reports'
import { Notifications } from './pages/Notifications'
import { Settings } from './pages/Settings'

export function App() {
  return (
    <ThemeProvider>
      <FinancialProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="categories" element={<Categories />} />
              <Route path="emi" element={<EMIManagement />} />
              <Route path="loans" element={<LoanManagement />} />
              <Route path="rent" element={<RentManagement />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="budgets" element={<Budgets />} />
              <Route path="reports" element={<Reports />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FinancialProvider>
    </ThemeProvider>
  )
}

export default App
