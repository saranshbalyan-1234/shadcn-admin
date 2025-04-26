import { createContext, useContext, useEffect, useState } from 'react'
import { generateThemeColors, applyThemeColors } from '@/lib/color-utils'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  primaryColor: string
  setPrimaryColor: (color: string) => void
  getEffectiveTheme: () => 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | null>(null)

ThemeContext.displayName = 'ThemeContext'

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme-mode',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const [primaryColor, setPrimaryColor] = useState<string>(
    () => localStorage.getItem('theme-color') || '#000000'
  )

  const getEffectiveTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    return theme === 'system'
      ? mediaQuery.matches
        ? 'dark'
        : 'light'
      : (theme as 'light' | 'dark')
  }

  const applyThemeSettings = () => {
    const root = window.document.documentElement
    const effectiveTheme = getEffectiveTheme()

    root.classList.remove('light', 'dark')
    root.classList.add(effectiveTheme)

    const themeColors = generateThemeColors(primaryColor)
    applyThemeColors(
      effectiveTheme === 'dark' ? themeColors.dark : themeColors.light
    )
  }

  useEffect(() => {
    applyThemeSettings()
  }, [theme, primaryColor])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    function handleSystemThemeChange() {
      if (theme === 'system') {
        applyThemeSettings()
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () =>
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [theme])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  const handlePrimaryColorChange = (color: string) => {
    setPrimaryColor(color)
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleThemeChange,
        primaryColor,
        setPrimaryColor: handlePrimaryColorChange,
        getEffectiveTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
