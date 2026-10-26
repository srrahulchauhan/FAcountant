import React, { useState, useEffect } from 'react'
import { useFinancial } from '../context/FinancialContext'
import { useTheme } from '../context/ThemeContext'
import { getStorageStats } from '../services/storageService'
import { exportJSONBackup, validateBackupFile } from '../services/backupService'
import { exportFullExcelWorkbook } from '../services/exportService'
import { PAYMENT_METHODS } from '../components/common/PaymentMethodSelect'
import { Modal } from '../components/common/Modal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import {
  Settings as SettingsIcon,
  User,
  ShieldAlert,
  Download,
  Upload,
  Trash2,
  FileSpreadsheet,
  HardDrive,
  Moon,
  Sun,
  Bell,
  CheckCircle2,
  Info,
  Lock,
  ShieldCheck,
  KeyRound
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useSecurity } from '../context/SecurityContext'

export const Settings = () => {
  const {
    settings,
    updateSettings,
    restoreAllData,
    resetAllData,
    income,
    expenses,
    categories,
    emiRecords,
    emiPayments,
    loans,
    loanPayments,
    rentRecords,
    rentPayments,
    budgets
  } = useFinancial()

  const { isDark, toggleTheme } = useTheme()

  // Profile Form state
  const [profile, setProfile] = useState({
    name: settings.profile?.name || '',
    email: settings.profile?.email || '',
    phone: settings.profile?.phone || '',
    city: settings.profile?.city || ''
  })

  // Preference fields
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState(settings.defaultPaymentMethod || 'UPI')
  const [remindersEnabled, setRemindersEnabled] = useState(settings.remindersEnabled !== false)
  const [reminderDaysBefore, setReminderDaysBefore] = useState(settings.reminderDaysBefore || 3)

  // Storage analytics
  const [storageStats, setStorageStats] = useState(getStorageStats())

  // Security Context
  const { passcode, changePasscode, resetPasscode, lockApp, defaultPasscode } = useSecurity()
  const [pinChangeState, setPinChangeState] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: ''
  })
  const [isChangingPin, setIsChangingPin] = useState(false)

  // Backup & Restore states
  const [importSummary, setImportSummary] = useState(null)
  const [dataToRestore, setDataToRestore] = useState(null)
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)

  useEffect(() => {
    setStorageStats(getStorageStats())
  }, [income, expenses, emiRecords, loans, rentRecords])

  const handleChangePasscodeSubmit = (e) => {
    e.preventDefault()
    if (pinChangeState.newPin !== pinChangeState.confirmPin) {
      toast.error('New passcode and confirm passcode do not match.')
      return
    }
    const result = changePasscode(pinChangeState.currentPin, pinChangeState.newPin)
    if (result.success) {
      toast.success('Passcode updated successfully!')
      setPinChangeState({ currentPin: '', newPin: '', confirmPin: '' })
      setIsChangingPin(false)
    } else {
      toast.error(result.error || 'Failed to change passcode.')
    }
  }

  const handleResetPasscode = () => {
    resetPasscode()
    toast.success(`Passcode reset to master default (${defaultPasscode})`)
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    updateSettings({
      ...settings,
      profile,
      defaultPaymentMethod,
      remindersEnabled,
      reminderDaysBefore
    })
  }

  // Handle JSON file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result)
        const validation = validateBackupFile(parsed)
        if (!validation.valid) {
          toast.error(validation.error || 'Failed to validate backup file')
          return
        }
        setImportSummary(validation.summary)
        setDataToRestore(validation.dataToRestore)
      } catch (err) {
        toast.error('Could not parse JSON backup file. Ensure it is a valid FinTrack backup.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleConfirmRestore = () => {
    if (dataToRestore) {
      restoreAllData(dataToRestore)
      setDataToRestore(null)
      setImportSummary(null)
      setStorageStats(getStorageStats())
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
          Settings & LocalStorage Management
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Personalize profile preferences, themes, data backups, and local storage limits
        </p>
      </div>

      {/* LocalStorage Advisory Alert */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 dark:text-amber-300 space-y-1">
          <p className="font-bold">Privacy & Storage Notice (Frontend-Only Architecture):</p>
          <p className="leading-relaxed">
            All your financial records are encrypted and stored persistently on your device using Browser LocalStorage. No records are transmitted to third-party databases or cloud servers. Please use the <strong>JSON Backup</strong> feature below regularly to keep a safe personal copy.
          </p>
        </div>
      </div>

      {/* Profile & Application Preferences Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <User className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
            Personal Profile & Localization
          </h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile(p => ({ ...p, city: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Currency
              </label>
              <input
                type="text"
                disabled
                value="Indian Rupee (₹ INR)"
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 text-sm font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date Format
              </label>
              <input
                type="text"
                disabled
                value="DD/MM/YYYY"
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 text-sm font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Default Payment Method
              </label>
              <select
                value={defaultPaymentMethod}
                onChange={(e) => setDefaultPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {PAYMENT_METHODS.map(pm => (
                  <option key={pm.id} value={pm.id}>{pm.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Theme & Notifications Switches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2.5">
                {isDark ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Dark Theme</p>
                  <p className="text-[11px] text-slate-500">Toggle dark / light appearance</p>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDark ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">In-App Reminders</p>
                  <p className="text-[11px] text-slate-500">Show alerts for upcoming payments</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRemindersEnabled(!remindersEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  remindersEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    remindersEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all active:scale-95"
            >
              Save Profile Preferences
            </button>
          </div>
        </form>
      </div>

      {/* App Passcode Security Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                Passcode Protection & Screen Privacy
              </h3>
              <p className="text-xs text-slate-500">
                Auto-prompts on app open • Hidden masked entry keeps your finances confidential
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Active (Locked on Open)
          </span>
        </div>

        {/* Security Info & Master Passcode Notice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-indigo-500" />
              Master Passcode Configured
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Default passcode is set to <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">{defaultPasscode}</span>. When opening FinTrack, enter this code to unlock.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Screen Privacy ("Kisi Ko Na Dikhe")
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Password digits are masked with privacy dots (● ● ● ●) so onlookers or people nearby cannot view your passcode.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={lockApp}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <Lock className="w-4 h-4 text-rose-400" />
            <span>Lock Screen Now (Test Lock)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsChangingPin(!isChangingPin)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-xs sm:text-sm font-semibold transition-all border border-indigo-500/20 active:scale-95 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isChangingPin ? 'Cancel Passcode Change' : 'Change Passcode'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetPasscode}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer"
          >
            Reset to Default ({defaultPasscode})
          </button>
        </div>

        {/* Change Passcode Drawer Form */}
        {isChangingPin && (
          <form
            onSubmit={handleChangePasscodeSubmit}
            className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/60 space-y-4 animate-in fade-in duration-200 mt-3"
          >
            <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
              Update 4-Digit Passcode
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Passcode
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="e.g. 8052"
                  value={pinChangeState.currentPin}
                  onChange={(e) => setPinChangeState(p => ({ ...p, currentPin: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono tracking-widest text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New 4-Digit Passcode
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="4 digits"
                  value={pinChangeState.newPin}
                  onChange={(e) => setPinChangeState(p => ({ ...p, newPin: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono tracking-widest text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Passcode
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  placeholder="4 digits"
                  value={pinChangeState.confirmPin}
                  onChange={(e) => setPinChangeState(p => ({ ...p, confirmPin: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono tracking-widest text-center"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsChangingPin(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all"
              >
                Save New Passcode
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Storage Analytics & Status Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
              LocalStorage Diagnostics
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500 font-mono">
            {storageStats.usedKB} KB Used
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Daily Expenses</span>
            <span className="font-extrabold text-base text-slate-900 dark:text-white font-mono">{storageStats.counts.EXPENSES || 0}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Income Credits</span>
            <span className="font-extrabold text-base text-slate-900 dark:text-white font-mono">{storageStats.counts.INCOME || 0}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">EMI & Loan Plans</span>
            <span className="font-extrabold text-base text-slate-900 dark:text-white font-mono">{(storageStats.counts.EMI_RECORDS || 0) + (storageStats.counts.LOANS || 0)}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Rental Agreements</span>
            <span className="font-extrabold text-base text-slate-900 dark:text-white font-mono">{storageStats.counts.RENT_RECORDS || 0}</span>
          </div>
        </div>
      </div>

      {/* Backup & Restore Controls */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Download className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
            Backup & Data Portability
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Export your entire financial ledger to a JSON file or full 12-sheet Excel spreadsheet. You can restore this backup anytime or transfer your data across browsers.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={exportJSONBackup}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON Backup</span>
          </button>

          <button
            type="button"
            onClick={() => exportFullExcelWorkbook({ income, expenses, categories, emiRecords, emiPayments, loans, loanPayments, rentRecords, rentPayments, budgets, settings })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download 12-Sheet Excel</span>
          </button>

          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer active:scale-95">
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Restore JSON Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone: Clear Data */}
      <div className="p-6 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-rose-200/60 dark:border-rose-900/40">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <h3 className="text-base font-bold font-heading text-rose-700 dark:text-rose-400">
            Danger Zone
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Clear All Application Financial Data
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Permanently wipe all daily expenses, EMI records, loans, rent history, and local settings. Requires typed confirmation phrase.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all self-start sm:self-auto active:scale-95"
          >
            Clear All Data
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Restoring JSON Backup */}
      <Modal
        isOpen={importSummary !== null}
        onClose={() => { setImportSummary(null); setDataToRestore(null); }}
        title="Confirm Backup Restoration"
        subtitle="Validate records contained in this backup before replacing current data"
      >
        {importSummary && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2">
              <p className="font-bold text-slate-800 dark:text-slate-100">
                Backup Data Summary:
              </p>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <div>Expenses: <span className="font-bold">{importSummary.expenses}</span></div>
                <div>Income Credits: <span className="font-bold">{importSummary.income}</span></div>
                <div>EMI Records: <span className="font-bold">{importSummary.emiRecords}</span></div>
                <div>Loan Records: <span className="font-bold">{importSummary.loans}</span></div>
                <div>Rental Properties: <span className="font-bold">{importSummary.rentRecords}</span></div>
                <div>Categories: <span className="font-bold">{importSummary.categories}</span></div>
              </div>
            </div>

            <p className="text-rose-600 dark:text-rose-400 font-semibold text-center">
              Restoring will replace existing records with the backup file data.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => { setImportSummary(null); setDataToRestore(null); }}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRestore}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                Restore Records Now
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Clear All Data Confirm Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetAllData}
        title="Erase All Financial Records"
        message="This action will delete all stored records, payments, and configurations permanently from your browser LocalStorage."
        confirmText="Confirm Permanent Erase"
        requirePhrase="DELETE ALL DATA"
        danger={true}
      />
    </div>
  )
}
