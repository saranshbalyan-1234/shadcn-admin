import { oklch, parse } from 'culori'

type ThemeColors = {
  background: string
  foreground: string
  card: string
  'card-foreground': string
  popover: string
  'popover-foreground': string
  primary: string
  'primary-foreground': string
  secondary: string
  'secondary-foreground': string
  muted: string
  'muted-foreground': string
  accent: string
  'accent-foreground': string
  destructive: string
  'destructive-foreground': string
  border: string
  input: string
  ring: string
}

function oklchToString(l: number, c: number, h: number): string {
  return `oklch(${l} ${c} ${h})`
}

function createThemeColors(
  lightness: number,
  chroma: number,
  hue: number
): { light: ThemeColors; dark: ThemeColors } {
  // Light theme generation
  const light: ThemeColors = {
    background: oklchToString(1, 0, 0), // White
    foreground: oklchToString(0.129, 0.042, hue),
    card: oklchToString(1, 0, 0),
    'card-foreground': oklchToString(0.129, 0.042, hue),
    popover: oklchToString(1, 0, 0),
    'popover-foreground': oklchToString(0.129, 0.042, hue),
    primary: oklchToString(lightness, chroma, hue),
    'primary-foreground': oklchToString(0.984, 0.003, hue - 18),
    secondary: oklchToString(0.968, chroma * 0.15, hue),
    'secondary-foreground': oklchToString(lightness, chroma, hue),
    muted: oklchToString(0.968, chroma * 0.15, hue),
    'muted-foreground': oklchToString(0.554, chroma * 0.8, hue),
    accent: oklchToString(0.968, chroma * 0.15, hue),
    'accent-foreground': oklchToString(lightness, chroma, hue),
    destructive: oklchToString(0.577, 0.245, 27.325),
    'destructive-foreground': oklchToString(0.984, 0.003, hue - 18),
    border: oklchToString(0.929, chroma * 0.2, hue),
    input: oklchToString(0.929, chroma * 0.2, hue),
    ring: oklchToString(lightness, chroma, hue),
  }

  // Dark theme generation
  const dark: ThemeColors = {
    background: oklchToString(0.129, 0.042, hue),
    foreground: oklchToString(0.984, 0.003, hue - 18),
    card: oklchToString(0.14, 0.04, hue),
    'card-foreground': oklchToString(0.984, 0.003, hue - 18),
    popover: oklchToString(0.129, 0.042, hue),
    'popover-foreground': oklchToString(0.984, 0.003, hue - 18),
    primary: oklchToString(0.929, chroma * 1.2, hue),
    'primary-foreground': oklchToString(0.129, 0.042, hue),
    secondary: oklchToString(0.279, chroma * 0.8, hue),
    'secondary-foreground': oklchToString(0.984, 0.003, hue - 18),
    muted: oklchToString(0.279, chroma * 0.8, hue),
    'muted-foreground': oklchToString(0.704, chroma * 0.6, hue),
    accent: oklchToString(0.279, chroma * 0.8, hue),
    'accent-foreground': oklchToString(0.984, 0.003, hue - 18),
    destructive: oklchToString(0.704, 0.191, 22.216),
    'destructive-foreground': oklchToString(0.984, 0.003, hue - 18),
    border: oklchToString(0.279, chroma * 0.8, hue),
    input: oklchToString(0.279, chroma * 0.8, hue),
    ring: oklchToString(0.551, chroma * 0.4, hue),
  }

  return { light, dark }
}

export function generateThemeColors(baseColor: string): {
  light: ThemeColors
  dark: ThemeColors
} {
  try {
    // Parse the input color and convert to OKLCH
    const color = parse(baseColor)
    if (!color) {
      throw new Error('Invalid color format')
    }

    const oklchColor = oklch(color)
    if (!oklchColor) {
      throw new Error('Color conversion failed')
    }

    const { l: lightness = 0.5, c: chroma = 0.1, h: hue = 0 } = oklchColor
    return createThemeColors(lightness, chroma, hue)
  } catch (error) {
    console.error('Color generation failed:', error)
    // Fallback to a default color theme (using a neutral blue)
    return createThemeColors(0.5, 0.1, 250)
  }
}

export function applyThemeColors(colors: ThemeColors) {
  const root = document.documentElement
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value)
  })
}
