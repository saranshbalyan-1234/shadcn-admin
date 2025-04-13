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

    // Apply theme CSS variables
    const root = document.documentElement
    const cssVars = currentTheme.cssVars[theme === "dark" ? "dark" : "light"]
    
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
  }, [config.radius, config.theme, theme])

  return (
    <div
      className={cn(
        theme === "dark" ? "dark" : "",
        "w-full",
        className
      )}
    >
      {children}
    </div>
  )
}
