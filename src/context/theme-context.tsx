import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, _setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  // Apply theme colors and custom theme if applicable
  const applyThemeColors = useCallback(() => {
    const root = document.documentElement
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light'
    const effectiveTheme = theme === 'system' ? systemTheme : theme

    root.classList.remove('light', 'dark')
    root.classList.add(effectiveTheme)

    // Check for custom theme
    const customTheme = localStorage.getItem('custom-theme')
    const configStr = localStorage.getItem('config')

    if (customTheme && configStr) {
      const config = JSON.parse(configStr)
      if (config.theme === 'custom') {
        try {
          const themeData = JSON.parse(customTheme)
          // Apply all CSS variables for the current theme mode
          Object.entries(themeData.cssVars[effectiveTheme]).forEach(
            ([key, value]) => {
              root.style.setProperty(`--${key}`, value as string)
            }
          )
        } catch (error) {
          console.error('Error applying custom theme:', error)
        }
      }
    }
  }, [theme])

  // Initialize theme immediately on mount
  useEffect(() => {
    const init = () => {
      applyThemeColors()
    }

    // Run initialization
    init()

    // Also set up a small delay to ensure proper application after hydration
    const timer = setTimeout(init, 0)
    return () => clearTimeout(timer)
  }, [applyThemeColors])

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyThemeColors()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, applyThemeColors])

  const setTheme = (theme: Theme) => {
    localStorage.setItem(storageKey, theme)
    _setTheme(theme)
    // Apply theme colors immediately when theme changes
    setTimeout(() => applyThemeColors(), 0)
  }

  const value = {
    theme,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
