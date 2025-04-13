import { createContext, useContext, useEffect, useState } from 'react'

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

  // Update theme applying logic
  const applyTheme = (newTheme: string) => {
    const root = document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const effectiveTheme = newTheme === 'system' ? systemTheme : newTheme;
    
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);

    // If using custom theme, apply all theme variables
    const customTheme = localStorage.getItem('custom-theme');
    const config = localStorage.getItem('shadcn-ui:theme');
    const currentTheme = config ? JSON.parse(config).theme : null;

    if (customTheme && currentTheme === 'custom') {
      const themeData = JSON.parse(customTheme);
      Object.entries(themeData.cssVars[effectiveTheme]).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value as string);
      });
    }
  }

  // Effect for theme changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme, applyTheme])

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (theme: Theme) => {
    localStorage.setItem(storageKey, theme)
    _setTheme(theme)
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
