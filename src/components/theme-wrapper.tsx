import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { useTheme } from "@/context/theme-context"
import { baseColors } from "@/base-colors"

interface ThemeWrapperProps extends React.ComponentProps<"div"> {
  defaultTheme?: string
}

export function ThemeWrapper({
  defaultTheme,
  children,
  className,
}: ThemeWrapperProps) {
  const [config] = useConfig()
  const { theme } = useTheme()

  useEffect(() => {
    // Set radius
    document.documentElement.style.setProperty("--radius", `${config.radius}rem`)

    // Find the current theme colors
    const currentTheme = baseColors.find((t) => t.name === config.theme)
    if (!currentTheme) return

    // Get the effective theme based on system preference
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const effectiveTheme = theme === 'system' ? systemTheme : theme

    // Apply theme CSS variables
    const root = document.documentElement
    const cssVars = currentTheme.cssVars[effectiveTheme]
    
    Object.entries(cssVars).forEach(([key, value]) => {
      if (key === 'radius') return // Skip radius as we handle it separately
      root.style.setProperty(`--${key}`, value)
    })

    // Apply theme class
    root.classList.remove('light', 'dark')
    root.classList.add(effectiveTheme)
  }, [config.radius, config.theme, theme])

  return (
    <div
      className={cn(
        "w-full",
        className
      )}
    >
      {children}
    </div>
  )
}
