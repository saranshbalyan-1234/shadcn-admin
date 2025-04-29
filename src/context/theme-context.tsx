import { createContext, useContext, useEffect, useState } from 'react'
import { generateThemeColors, applyThemeColors } from '@/lib/color-utils'

export type Theme = 'dark' | 'light' | 'system'
export type Radius = string

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
  radius: Radius
  setRadius: (radius: Radius) => void
  getEffectiveTheme: () => 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | null>(null)

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
  const [radius, setRadius] = useState<Radius>(
    () => (localStorage.getItem('theme-radius') as Radius) || '0.5'
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

    // Apply theme class
    root.classList.remove('light', 'dark')
    root.classList.add(effectiveTheme)

    // Apply radius
    const remValue = parseFloat(radius)
    document.documentElement.style.setProperty('--radius', `${remValue}rem`)

    // Apply colors
    const themeColors = generateThemeColors(primaryColor)
    applyThemeColors(
      effectiveTheme === 'dark' ? themeColors.dark : themeColors.light
    )
  }

  // Apply theme settings whenever any theme-related value changes
  useEffect(() => {
    applyThemeSettings()
  }, [theme, primaryColor, radius])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyThemeSettings()
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const contextValue: ThemeContextType = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme)
      // Theme changes will be applied by the useEffect
    },
    primaryColor,
    setPrimaryColor: (color: string) => {
      setPrimaryColor(color)
      // Color changes will be applied by the useEffect
    },
    radius,
    setRadius: (value: Radius) => {
      setRadius(value)
      // Radius changes will be applied by the useEffect
    },
    getEffectiveTheme,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
