import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const SECURITY_STORAGE_KEY = 'fintrack_security_passcode'
const DEFAULT_PASSCODE = '8052'
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION_SEC = 30

const SecurityContext = createContext(null)

export const SecurityProvider = ({ children }) => {
  // Always lock when the application is opened / loaded
  const [isLocked, setIsLocked] = useState(true)
  
  // Stored passcode (defaults to 8052)
  const [passcode, setPasscode] = useState(() => {
    try {
      const stored = localStorage.getItem(SECURITY_STORAGE_KEY)
      return stored && stored.length === 4 ? stored : DEFAULT_PASSCODE
    } catch {
      return DEFAULT_PASSCODE
    }
  })

  // Failed attempts and lockout timer
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockoutTimer, setLockoutTimer] = useState(0)

  // Handle countdown if locked out
  useEffect(() => {
    let interval = null
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setFailedAttempts(0)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [lockoutTimer])

  // Save passcode to localStorage when changed
  const savePasscode = (newPin) => {
    try {
      localStorage.setItem(SECURITY_STORAGE_KEY, newPin)
      setPasscode(newPin)
    } catch (err) {
      console.error('Failed to save passcode:', err)
    }
  }

  // Unlock application
  const unlockApp = (enteredPin) => {
    if (lockoutTimer > 0) {
      toast.error(`Too many attempts! Please wait ${lockoutTimer}s.`)
      return { success: false, error: `Locked out for ${lockoutTimer}s` }
    }

    if (enteredPin === passcode) {
      setIsLocked(false)
      setFailedAttempts(0)
      return { success: true }
    } else {
      const nextAttempts = failedAttempts + 1
      setFailedAttempts(nextAttempts)
      if (nextAttempts >= MAX_ATTEMPTS) {
        setLockoutTimer(LOCKOUT_DURATION_SEC)
        toast.error(`5 wrong attempts! Locked for ${LOCKOUT_DURATION_SEC} seconds.`)
      }
      return { success: false, error: 'Incorrect Passcode' }
    }
  }

  // Lock application manually
  const lockApp = () => {
    setIsLocked(true)
  }

  // Change Passcode
  const changePasscode = (currentPin, newPin) => {
    if (currentPin !== passcode) {
      return { success: false, error: 'Current passcode is incorrect.' }
    }
    if (!/^\d{4}$/.test(newPin)) {
      return { success: false, error: 'New passcode must be exactly 4 digits.' }
    }
    savePasscode(newPin)
    return { success: true }
  }

  // Reset to default 8052
  const resetPasscode = () => {
    savePasscode(DEFAULT_PASSCODE)
    return { success: true }
  }

  return (
    <SecurityContext.Provider
      value={{
        isLocked,
        passcode,
        failedAttempts,
        lockoutTimer,
        unlockApp,
        lockApp,
        changePasscode,
        resetPasscode,
        defaultPasscode: DEFAULT_PASSCODE
      }}
    >
      {children}
    </SecurityContext.Provider>
  )
}

export const useSecurity = () => {
  const context = useContext(SecurityContext)
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider')
  }
  return context
}
