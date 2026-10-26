import React, { createContext, useContext, useEffect, useState } from 'react'
import { getStoredItem, setStoredItem, STORAGE_KEYS } from '../services/storageService'
import { DEFAULT_SETTINGS } from '../services/defaultData'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const settings = getStoredItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
    return settings?.theme || 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      const settings = getStoredItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
      setStoredItem(STORAGE_KEYS.SETTINGS, { ...settings, theme: next })
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
