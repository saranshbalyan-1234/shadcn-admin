import { createContext, useContext, useEffect, useState } from 'react'
import { generateThemeColors, applyThemeColors } from '@/lib/color-utils'

type Theme = 'dark' | 'light' | 'system'
type Radius = string

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

    // Apply radius class
    root.classList.forEach((className) => {
      if (className.startsWith('radius-')) {
        root.classList.remove(className)
      }
    })
    // Convert slider value (0-1) to rem value (0-1rem)
    const remValue = parseFloat(radius)
    document.documentElement.style.setProperty('--radius', `${remValue}rem`)

    // Apply colors
    const themeColors = generateThemeColors(primaryColor)
    applyThemeColors(
      effectiveTheme === 'dark' ? themeColors.dark : themeColors.light
    )
  }

  useEffect(() => {
    applyThemeSettings()
  }, [theme, primaryColor, radius])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    function handleSystemThemeChange() {
      if (theme === 'system') {
        applyThemeSettings()
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [theme])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem(storageKey, newTheme)
  }

  const handlePrimaryColorChange = (color: string) => {
    setPrimaryColor(color)
  }

  const handleRadiusChange = (newRadius: Radius) => {
    setRadius(newRadius)
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleThemeChange,
        primaryColor,
        setPrimaryColor: handlePrimaryColorChange,
        radius,
        setRadius: handleRadiusChange,
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
