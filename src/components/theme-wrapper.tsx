import { useEffect } from 'react'
import { baseColors } from '@/base-colors'
import { cn } from '@/lib/utils'
import { useTheme } from '@/context/theme-context'
import { useConfig } from '@/hooks/use-config'

interface ThemeWrapperProps extends React.ComponentProps<'div'> {
  className?: string
}

export function ThemeWrapper({ children, className }: ThemeWrapperProps) {
  const [config] = useConfig()
  const { theme } = useTheme()

  useEffect(() => {
    // Set radius regardless of theme type
    document.documentElement.style.setProperty(
      '--radius',
      `${config.radius}rem`
    )

    // Only apply theme variables if not using custom theme
    if (config.theme !== 'custom') {
      // Find the current theme colors
      const currentTheme = baseColors.find((t) => t.name === config.theme)
      if (!currentTheme) return

      // Get the effective theme based on system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      const effectiveTheme = theme === 'system' ? systemTheme : theme

      // Apply theme CSS variables only for non-custom themes
      const root = document.documentElement
      const cssVars = currentTheme.cssVars[effectiveTheme]

      Object.entries(cssVars).forEach(([key, value]) => {
        if (key === 'radius') return // Skip radius as we handle it separately
        root.style.setProperty(`--${key}`, value)
      })
    }
  }, [config.radius, config.theme, theme])

  return <div className={cn('w-full', className)}>{children}</div>
}
