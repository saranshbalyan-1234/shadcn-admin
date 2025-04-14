import * as React from 'react'
import { baseColors } from '@/base-colors'
import { Check, Moon, Sun, CornerDownLeft } from 'lucide-react'
import { MonitorCog } from 'lucide-react'
import { ColorPicker as Picker, useColor } from 'react-color-palette'
import 'react-color-palette/dist/css/rcp.css'
import { cn } from '@/lib/utils'
import { useTheme } from '@/context/theme-context'
import { useConfig } from '@/hooks/use-config'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface CustomTheme {
  name: string
  label: string
  activeColor: {
    light: string
    dark: string
  }
  cssVars: {
    light: Record<string, string>
    dark: Record<string, string>
  }
}

// Color conversion utilities
function hslToHex(h: number, s: number, l: number): string {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function hexToHSL(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0 0% 0%'

  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

function ColorPicker({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (value: string) => void
  label: string
}) {
  const [h, s, l] = value.split(' ').map((v) => parseFloat(v) || 0)
  const [color, setColor] = useColor('hex')

  // Update the color when the input value changes
  React.useEffect(() => {
    const hex = hslToHex(h, s, l)
    setColor({
      hex,
      rgb: { r: 0, g: 0, b: 0, a: 1 },
      hsv: { h: 0, s: 0, v: 0, a: 1 },
    })
  }, [h, s, l])

  return (
    <div className='mb-4 flex justify-between gap-4'>
      <Label className='min-w-32 text-xs'>{label}</Label>
      <div className='relative'>
        <Popover>
          <PopoverTrigger asChild>
            <div
              className='mr-2 h-8 w-8 cursor-pointer rounded-full border'
              style={{ backgroundColor: color.hex }}
            />
          </PopoverTrigger>
          <PopoverContent className='w-[240px] p-4'>
            <Picker
              color={color}
              onChange={(newColor) => {
                setColor(newColor)
                onChange(hexToHSL(newColor.hex))
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export function ThemeSwitch() {
  const [config, setConfig] = useConfig()
  const { theme: mode } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className='flex items-center gap-2'>
      <Drawer>
        <DrawerTrigger asChild>
          {/* <Button size="sm" className="md:hidden"> */}
          <MonitorCog className='h-4 w-4 cursor-pointer md:hidden' />
          {/* </Button> */}
        </DrawerTrigger>
        <DrawerContent className='p-6 pt-0'>
          <Customizer />
        </DrawerContent>
      </Drawer>
      <div className='hidden items-center md:flex'>
        <Popover>
          <PopoverTrigger asChild>
            {/* <Button size="sm"> */}
            <MonitorCog className='h-4 w-4 cursor-pointer' />
            {/* </Button> */}
          </PopoverTrigger>
          <PopoverContent
            align='start'
            className='z-40 max-h-[85vh] w-[340px] rounded-[12px] bg-white p-6 dark:bg-zinc-950'
          >
            <Customizer />
          </PopoverContent>
        </Popover>
        <div className='ml-2 hidden items-center gap-0.5'>
          {mounted ? (
            <>
              {baseColors.map((baseColor) => {
                const isActive = config.theme === baseColor.name

                return (
                  <Tooltip key={baseColor.name}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          const selectedTheme = baseColors.find(
                            (t) => t.name === baseColor.name
                          )
                          if (!selectedTheme) return

                          const themeRadius = (
                            selectedTheme.cssVars.light as any
                          ).radius
                          const parsedRadius = themeRadius
                            ? parseFloat(themeRadius.replace('rem', ''))
                            : 0.5
                          const allowedRadii = [0, 0.3, 0.5, 0.75, 1.0]
                          const radius = allowedRadii.reduce((prev, curr) =>
                            Math.abs(curr - parsedRadius) <
                            Math.abs(prev - parsedRadius)
                              ? curr
                              : prev
                          )

                          setConfig((prev) => ({
                            ...prev,
                            theme: selectedTheme.name,
                            radius,
                          }))
                        }}
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs',
                          isActive
                            ? 'border-[--theme-primary]'
                            : 'border-transparent'
                        )}
                        style={
                          {
                            '--theme-primary': `hsl(${
                              baseColor?.activeColor[
                                mode === 'dark' ? 'dark' : 'light'
                              ]
                            })`,
                          } as React.CSSProperties
                        }
                      >
                        <span
                          className={cn(
                            'flex h-5 w-5 items-center justify-center rounded-full bg-[--theme-primary]'
                          )}
                        >
                          {isActive && <Check className='h-4 w-4 text-white' />}
                        </span>
                        <span className='sr-only'>{baseColor.label}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      align='center'
                      className='rounded-[0.5rem] bg-zinc-900 text-zinc-50'
                    >
                      {baseColor.label}
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </>
          ) : (
            <div className='mr-1 flex items-center gap-4'>
              <Skeleton className='h-5 w-5 rounded-full' />
              <Skeleton className='h-5 w-5 rounded-full' />
              <Skeleton className='h-5 w-5 rounded-full' />
              <Skeleton className='h-5 w-5 rounded-full' />
              <Skeleton className='h-5 w-5 rounded-full' />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Customizer() {
  const [mounted, setMounted] = React.useState(false)
  const { setTheme, theme: mode } = useTheme()
  const [config, setConfig] = useConfig()
  const [themeType, setThemeType] = React.useState<'predefined' | 'custom'>(
    config.theme === 'custom' ? 'custom' : 'predefined'
  )

  const [customTheme, setCustomTheme] = React.useState<CustomTheme>(() => {
    const saved = localStorage.getItem('custom-theme')
    return saved
      ? JSON.parse(saved)
      : {
          name: 'custom',
          label: 'Custom',
          activeColor: {
            light: '0 0% 0%',
            dark: '0 0% 100%',
          },
          cssVars: {
            light: { ...baseColors[0].cssVars.light },
            dark: { ...baseColors[0].cssVars.dark },
          },
        }
  })

  // Mount effect
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Update theme type when config changes
  React.useEffect(() => {
    setThemeType(config.theme === 'custom' ? 'custom' : 'predefined')
  }, [config.theme])

  const handleThemeVarChange = (
    targetMode: 'light' | 'dark',
    key: string,
    value: string
  ) => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light'
    const effectiveMode = mode === 'system' ? systemTheme : mode

    // Update config to custom theme
    setConfig({
      ...config,
      theme: 'custom',
    })

    // Update custom theme
    setCustomTheme((prev: CustomTheme) => {
      const updated = {
        ...prev,
        cssVars: {
          ...prev.cssVars,
          [targetMode]: {
            ...prev.cssVars[targetMode],
            [key]: value,
          },
        },
      }

      // Save to localStorage
      localStorage.setItem('custom-theme', JSON.stringify(updated))

      // Apply variables if we're modifying the current mode
      if (targetMode === effectiveMode) {
        const root = document.documentElement
        Object.entries(updated.cssVars[targetMode]).forEach(
          ([cssKey, cssValue]) => {
            root.style.setProperty(`--${cssKey}`, cssValue as string)
          }
        )
      }

      return updated
    })
  }

  // const applyCustomTheme = () => {
  //   const root = document.documentElement
  //   const currentMode = mode === 'system'
  //     ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  //     : mode

  //   Object.entries(customTheme.cssVars[currentMode]).forEach(([key, value]) => {
  //     root.style.setProperty(`--${key}`, value as string)
  //   })

  //   setConfig({
  //     ...config,
  //     theme: "custom"
  //   })
  // }

  return (
    <>
      <div className='flex items-start pt-4 md:pt-0'>
        <div className='space-y-1 pr-2'>
          <div className='font-semibold leading-none tracking-tight'>
            Customize
          </div>
        </div>
        <Button
          variant='ghost'
          size='icon'
          className='ml-auto rounded-[0.5rem]'
          onClick={() => {
            // Get the default zinc theme
            const defaultTheme = baseColors.find((t) => t.name === 'zinc')
            if (!defaultTheme) return

            // Reset to zinc theme configuration
            setConfig({
              ...config,
              theme: 'zinc',
              radius: 0.5,
            })

            // Remove custom theme from localStorage
            localStorage.removeItem('custom-theme')
            setThemeType('predefined')

            // Get current mode and reset CSS variables
            const systemTheme = window.matchMedia(
              '(prefers-color-scheme: dark)'
            ).matches
              ? 'dark'
              : 'light'
            const currentMode = mode === 'system' ? systemTheme : mode
            const root = document.documentElement

            // Reset all CSS variables for both light and dark modes
            const varsToReset = new Set([
              ...Object.keys(defaultTheme.cssVars.light),
              ...Object.keys(defaultTheme.cssVars.dark),
            ])

            // Apply the current mode's default values
            varsToReset.forEach((key) => {
              const cssVars = defaultTheme.cssVars[currentMode] as Record<
                string,
                string
              >
              const value = cssVars[key]
              if (value) {
                root.style.setProperty(`--${key}`, value)
              }
            })

            // Reset the custom theme state to default zinc values
            setCustomTheme({
              name: 'custom',
              label: 'Custom',
              activeColor: {
                light: defaultTheme.activeColor.light,
                dark: defaultTheme.activeColor.dark,
              },
              cssVars: {
                light: { ...defaultTheme.cssVars.light },
                dark: { ...defaultTheme.cssVars.dark },
              },
            })
          }}
        >
          <CornerDownLeft className='h-5 w-5' strokeWidth={1} />
          <span className='sr-only'>Reset</span>
        </Button>
      </div>

      <div className='flex flex-1 flex-col space-y-4 md:space-y-6'>
        <div className='space-y-1.5'>
          <Label className='text-xs'>Color</Label>
          <Tabs
            value={themeType}
            onValueChange={(v) => {
              const newType = v as 'predefined' | 'custom'
              setThemeType(newType)

              if (newType === 'custom') {
                // Set theme to custom
                setConfig({
                  ...config,
                  theme: 'custom',
                })

                // Apply the current mode's colors immediately
                const systemTheme = window.matchMedia(
                  '(prefers-color-scheme: dark)'
                ).matches
                  ? 'dark'
                  : 'light'
                const currentMode = mode === 'system' ? systemTheme : mode

                const root = document.documentElement
                Object.entries(customTheme.cssVars[currentMode]).forEach(
                  ([key, value]) => {
                    root.style.setProperty(`--${key}`, value as string)
                  }
                )
              } else {
                setConfig({
                  ...config,
                  theme: 'zinc',
                })
              }
            }}
          >
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='predefined'>Predefined</TabsTrigger>
              <TabsTrigger value='custom'>Custom</TabsTrigger>
            </TabsList>
            <TabsContent value='predefined'>
              <div className='grid grid-cols-3 gap-2'>
                {baseColors.map((theme) => {
                  const isActive = config.theme === theme.name

                  return mounted ? (
                    <Button
                      variant={'outline'}
                      size='sm'
                      key={theme.name}
                      onClick={() => {
                        setConfig({
                          ...config,
                          theme: theme.name,
                        })
                      }}
                      className={cn(
                        'justify-start',
                        isActive && 'border-2 border-primary'
                      )}
                      style={
                        {
                          '--theme-primary': `hsl(${
                            theme?.activeColor[
                              mode === 'dark' ? 'dark' : 'light'
                            ]
                          })`,
                        } as React.CSSProperties
                      }
                    >
                      <span
                        className={cn(
                          'flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]'
                        )}
                      >
                        {isActive && <Check className='h-4 w-4 text-white' />}
                      </span>
                      {theme.label}
                    </Button>
                  ) : (
                    <Skeleton className='h-8 w-full' key={theme.name} />
                  )
                })}
              </div>
            </TabsContent>
            <TabsContent value='custom'>
              <div className='scrollbar-thin h-[30vh] space-y-4 overflow-y-auto pr-4'>
                <div>
                  <Label className='text-l font-bold'>Light Mode Colors</Label>
                  <div className='mt-4'>
                    {Object.entries(customTheme.cssVars.light)
                      .filter(([key]) => key !== 'radius')
                      .map(([key, value]) => (
                        <ColorPicker
                          key={key}
                          label={key
                            .replace(/-/g, ' ')
                            .replace(/^[a-z]/, (c) => c.toUpperCase())}
                          value={value as string}
                          onChange={(newValue) =>
                            handleThemeVarChange('light', key, newValue)
                          }
                        />
                      ))}
                  </div>
                </div>
                <div>
                  <Label className='text-l font-bold'>Dark Mode Colors</Label>
                  <div className='mt-4'>
                    {Object.entries(customTheme.cssVars.dark)
                      .filter(([key]) => key !== 'radius')
                      .map(([key, value]) => (
                        <ColorPicker
                          key={key}
                          label={key
                            .replace(/-/g, ' ')
                            .replace(/^[a-z]/, (c) => c.toUpperCase())}
                          value={value as string}
                          onChange={(newValue) =>
                            handleThemeVarChange('dark', key, newValue)
                          }
                        />
                      ))}
                  </div>
                </div>
              </div>
              {/* <div className="sticky bottom-0 pt-4 bg-background">
                <Button 
                  onClick={() => {
                    applyCustomTheme();
                    setThemeType('custom');
                  }}
                  className="w-full"
                >
                  Apply Custom Theme
                </Button>
              </div> */}
            </TabsContent>
          </Tabs>
        </div>

        <div className='space-y-1.5'>
          <Label className='text-xs'>Radius</Label>
          <div className='grid grid-cols-5 gap-2'>
            {['0', '0.3', '0.5', '0.75', '1.0'].map((value) => (
              <Button
                variant={'outline'}
                size='sm'
                key={value}
                onClick={() => {
                  setConfig({
                    ...config,
                    radius: parseFloat(value),
                  })
                }}
                className={cn(
                  config.radius === parseFloat(value) &&
                    'border-2 border-primary'
                )}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>

        <div className='space-y-1.5'>
          <Label className='text-xs'>Mode</Label>
          <div className='grid grid-cols-3 gap-2'>
            {mounted ? (
              <>
                <Button
                  variant={'outline'}
                  size='sm'
                  onClick={() => setTheme('light')}
                  className={cn(mode === 'light' && 'border-2 border-primary')}
                >
                  <Sun
                    className='mr-1 h-5 w-5 -translate-x-1'
                    strokeWidth={1}
                  />
                  Light
                </Button>
                <Button
                  variant={'outline'}
                  size='sm'
                  onClick={() => setTheme('dark')}
                  className={cn(mode === 'dark' && 'border-2 border-primary')}
                >
                  <Moon
                    className='mr-1 h-5 w-5 -translate-x-1'
                    strokeWidth={1}
                  />
                  Dark
                </Button>
                <Button
                  variant={'outline'}
                  size='sm'
                  onClick={() => setTheme('system')}
                  className={cn(mode === 'system' && 'border-2 border-primary')}
                >
                  <CornerDownLeft
                    className='mr-1 h-5 w-5 -translate-x-1'
                    strokeWidth={1}
                  />
                  System
                </Button>
              </>
            ) : (
              <>
                <Skeleton className='h-8 w-full' />
                <Skeleton className='h-8 w-full' />
                <Skeleton className='h-8 w-full' />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
