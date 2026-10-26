import React, { useState, useEffect, useRef } from 'react'
import {
  Lock,
  Unlock,
  ShieldCheck,
  Eye,
  EyeOff,
  Delete,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { useSecurity } from '../../context/SecurityContext'

export const LockScreen = () => {
  const { isLocked, unlockApp, lockoutTimer, defaultPasscode } = useSecurity()
  const [pin, setPin] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'error' | 'success'
  const [showPin, setShowPin] = useState(false) // Default false: "hide pass word kisi ko na dikhe"
  const [showHint, setShowHint] = useState(false)
  const inputRef = useRef(null)

  // Keep input focused so physical keyboard works immediately
  useEffect(() => {
    if (isLocked) {
      inputRef.current?.focus()
      setPin('')
      setStatus('idle')
    }
  }, [isLocked])

  // Handle direct keyboard input listener
  useEffect(() => {
    if (!isLocked) return

    const handleKeyDown = (e) => {
      if (lockoutTimer > 0) return

      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key)
      } else if (e.key === 'Backspace') {
        handleBackspace()
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        handleClear()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLocked, pin, lockoutTimer])

  // Handle auto-submit on 4 digits
  useEffect(() => {
    if (pin.length === 4) {
      verifyPin(pin)
    }
  }, [pin])

  const verifyPin = (codeToTest) => {
    const result = unlockApp(codeToTest)
    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
      // Auto-clear pin after shake so user can quickly retry
      setTimeout(() => {
        setPin('')
        setStatus('idle')
      }, 700)
    }
  }

  const handleDigit = (digit) => {
    if (lockoutTimer > 0 || status === 'success') return
    if (pin.length < 4) {
      setPin((prev) => prev + digit)
      setStatus('idle')
    }
  }

  const handleBackspace = () => {
    if (lockoutTimer > 0 || status === 'success') return
    setPin((prev) => prev.slice(0, -1))
    setStatus('idle')
  }

  const handleClear = () => {
    if (lockoutTimer > 0 || status === 'success') return
    setPin('')
    setStatus('idle')
  }

  if (!isLocked) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl transition-all duration-300 select-none">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Invisible auto-focused input for mobile/virtual keyboards and IME */}
      <input
        ref={inputRef}
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={4}
        value={pin}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, '').slice(0, 4)
          setPin(val)
        }}
        className="opacity-0 absolute pointer-events-none w-0 h-0"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* App Logo & Vault Icon */}
        <div className="relative">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 p-0.5 shadow-xl shadow-indigo-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center transition-transform">
              {status === 'success' ? (
                <CheckCircle2 className="w-9 h-9 sm:w-10 sm:h-10 text-emerald-400 animate-in zoom-in-75 duration-200" />
              ) : status === 'error' ? (
                <Lock className="w-9 h-9 sm:w-10 sm:h-10 text-rose-500 animate-shake" />
              ) : (
                <Lock className="w-9 h-9 sm:w-10 sm:h-10 text-indigo-400" />
              )}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full border-2 border-slate-950 text-white shadow-sm" title="Security Active">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Title & Privacy Subtext */}
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading text-white">
            FinTrack Vault
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xs">
            Enter 4-digit passcode to unlock your financial account
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-semibold text-slate-400 mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Strict Privacy: Passcode is masked</span>
          </div>
        </div>

        {/* Masked PIN Indicator Dots ("hide pass word kisi ko na dikhe") */}
        <div className={`space-y-3 w-full ${status === 'error' ? 'animate-shake' : ''}`}>
          <div className="flex items-center justify-center gap-4 py-2">
            {[0, 1, 2, 3].map((index) => {
              const isFilled = index < pin.length
              return (
                <div
                  key={index}
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-200 border-2 ${
                    status === 'error'
                      ? 'border-rose-500 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                      : status === 'success'
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : isFilled
                      ? 'border-indigo-500 bg-indigo-500/15 shadow-[0_0_15px_rgba(99,102,241,0.25)] scale-105'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  {isFilled ? (
                    showPin ? (
                      <span className="text-2xl font-black text-indigo-400 font-heading">
                        {pin[index]}
                      </span>
                    ) : (
                      /* Solid Hidden Mask Dot - nobody can see the digit! */
                      <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-in zoom-in-50 duration-150" />
                    )
                  ) : (
                    /* Empty Hollow Slot */
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700/60" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Error / Lockout Messages */}
          {status === 'error' && (
            <p className="text-xs font-bold text-rose-400 flex items-center justify-center gap-1.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Incorrect Passcode! Please try again.</span>
            </p>
          )}

          {status === 'success' && (
            <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Passcode Verified! Access Granted.</span>
            </p>
          )}

          {lockoutTimer > 0 && (
            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 font-semibold">
              Too many failed attempts. Try again in {lockoutTimer}s.
            </div>
          )}
        </div>

        {/* Security & Mask Toggle Controls */}
        <div className="flex items-center justify-between w-full px-2 text-xs text-slate-400">
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors py-1 px-2 rounded-lg hover:bg-slate-900"
            title={showPin ? "Hide passcode" : "Temporarily peek passcode"}
          >
            {showPin ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
            <span>{showPin ? 'Hide PIN (Secret)' : 'Show PIN'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium py-1 px-2 rounded-lg hover:bg-slate-900 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Passcode Info</span>
          </button>
        </div>

        {/* Hint banner if requested */}
        {showHint && (
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-left text-xs text-indigo-200 w-full animate-in fade-in duration-150 space-y-1">
            <p className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              FinTrack Default Passcode:
            </p>
            <p className="text-indigo-300">
              The preset passcode is <span className="font-mono font-bold text-white bg-indigo-900/80 px-2 py-0.5 rounded border border-indigo-700">{defaultPasscode}</span>. Type <span className="font-bold text-white">8052</span> to unlock.
            </p>
          </div>
        )}

        {/* On-Screen Touch / Mouse Keypad */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={lockoutTimer > 0 || status === 'success'}
              onClick={() => handleDigit(digit)}
              className="h-13 sm:h-14 rounded-2xl bg-slate-900/80 hover:bg-slate-800 active:bg-indigo-600 border border-slate-800/80 hover:border-slate-700 text-xl font-bold font-heading text-white shadow-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            >
              {digit}
            </button>
          ))}

          {/* Clear Key */}
          <button
            type="button"
            disabled={lockoutTimer > 0 || pin.length === 0}
            onClick={handleClear}
            className="h-13 sm:h-14 rounded-2xl bg-slate-900/50 hover:bg-slate-800 border border-slate-800/60 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
          >
            Clear
          </button>

          {/* 0 Key */}
          <button
            type="button"
            disabled={lockoutTimer > 0 || status === 'success'}
            onClick={() => handleDigit('0')}
            className="h-13 sm:h-14 rounded-2xl bg-slate-900/80 hover:bg-slate-800 active:bg-indigo-600 border border-slate-800/80 hover:border-slate-700 text-xl font-bold font-heading text-white shadow-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
          >
            0
          </button>

          {/* Backspace Key */}
          <button
            type="button"
            disabled={lockoutTimer > 0 || pin.length === 0}
            onClick={handleBackspace}
            className="h-13 sm:h-14 rounded-2xl bg-slate-900/50 hover:bg-slate-800 border border-slate-800/60 text-slate-300 hover:text-white transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            aria-label="Delete last digit"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-[11px] text-slate-500 font-medium">
          Supports physical keyboard typing • Protected by FinTrack Local Vault
        </p>
      </div>
    </div>
  )
}
