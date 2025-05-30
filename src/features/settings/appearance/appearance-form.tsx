import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { fonts } from '@/config/fonts'
import { cn } from '@/lib/utils'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { useFont } from '@/context/font-context'
import { useTheme } from '@/context/theme-context'
import type { Theme } from '@/context/theme-context'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'

const appearanceFormSchema = z.object({
  theme: z.enum(['light', 'dark', 'system'], {
    required_error: 'Please select a theme.',
  }),
  font: z.enum(fonts, {
    invalid_type_error: 'Select a font',
    required_error: 'Please select a font.',
  }),
  primaryColor: z.string().min(1, 'Please select a primary color'),
  radius: z.string().min(1, 'Please select a radius value'),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

export function AppearanceForm() {
  const { font, setFont } = useFont()
  const { theme, setTheme, primaryColor, setPrimaryColor, radius, setRadius } =
    useTheme()

  const defaultValues: Partial<AppearanceFormValues> = {
    theme,
    font,
    primaryColor,
    radius: radius || '0.5', // Ensure we have a default value
  }

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  })

  function onSubmit(data: AppearanceFormValues) {
    // Save all preferences to localStorage
    localStorage.setItem('theme-mode', data.theme)
    localStorage.setItem('theme-color', data.primaryColor)
    localStorage.setItem('theme-font', data.font)
    localStorage.setItem('theme-radius', data.radius)

    showSubmittedData(data)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    form.setValue('primaryColor', color)
    setPrimaryColor(color)
  }

  const handleCancel = () => {
    // Read values from localStorage with type checking
    const storedTheme =
      (localStorage.getItem('theme-mode') as Theme) || 'system'
    const storedFont = localStorage.getItem('theme-font') || 'inter'
    const storedColor = localStorage.getItem('theme-color') || '#000000'
    const storedRadius = localStorage.getItem('theme-radius') || '0.5'

    // Validate font is one of the allowed values
    const validFont = fonts.includes(storedFont as any) ? storedFont : 'inter'

    // Update form values
    form.reset({
      theme: storedTheme,
      font: validFont as (typeof fonts)[number],
      primaryColor: storedColor,
      radius: storedRadius,
    })

    // Apply values through context
    setTheme(storedTheme)
    setFont(validFont as (typeof fonts)[number])
    setPrimaryColor(storedColor)
    setRadius(storedRadius)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='font'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font</FormLabel>
              <div className='relative w-max'>
                <FormControl>
                  <select
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'w-[200px] appearance-none font-normal capitalize'
                    )}
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value as typeof field.value
                      field.onChange(value)
                      setFont(value)
                    }}
                  >
                    {fonts.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <ChevronDownIcon className='absolute top-2.5 right-3 h-4 w-4 opacity-50' />
              </div>
              <FormDescription className='font-manrope'>
                Set the font you want to use in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='primaryColor'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Color</FormLabel>
              <div className='flex items-center gap-4'>
                <FormControl>
                  <Input
                    type='color'
                    className='h-10 w-16'
                    {...field}
                    onChange={handleColorChange}
                  />
                </FormControl>
                <FormControl>
                  <Input {...field} placeholder='Color hex value' />
                </FormControl>
              </div>
              <FormDescription>
                Choose a primary color to generate the theme palette
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='theme'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Theme</FormLabel>
              <FormDescription>
                Select the theme for the dashboard.
              </FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value)
                  setTheme(value as Theme)
                }}
                value={field.value}
                className='flex w-full flex-wrap items-center justify-between space-x-2'
              >
                <FormItem>
                  <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                    <FormControl>
                      <RadioGroupItem value='light' className='sr-only' />
                    </FormControl>
                    <div className='border-muted hover:border-accent items-center rounded-md border-2 p-1'>
                      <div className='space-y-2 rounded-sm bg-[#ecedef] p-2'>
                        <div className='space-y-2 rounded-md bg-white p-2 shadow-xs'>
                          <div className='h-2 w-[80px] rounded-lg bg-[#ecedef]' />
                          <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                        </div>
                        <div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs'>
                          <div className='h-4 w-4 rounded-full bg-[#ecedef]' />
                          <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                        </div>
                      </div>
                    </div>
                  </FormLabel>
                </FormItem>

                <FormItem>
                  <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                    <FormControl>
                      <RadioGroupItem value='dark' className='sr-only' />
                    </FormControl>
                    <div className='border-muted bg-popover hover:bg-accent hover:text-accent-foreground items-center rounded-md border-2 p-1'>
                      <div className='space-y-2 rounded-sm bg-slate-950 p-2'>
                        <div className='space-y-2 rounded-md bg-slate-800 p-2 shadow-xs'>
                          <div className='h-2 w-[80px] rounded-lg bg-slate-400' />
                          <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                        </div>
                        <div className='flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs'>
                          <div className='h-4 w-4 rounded-full bg-slate-400' />
                          <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                        </div>
                      </div>
                    </div>
                  </FormLabel>
                </FormItem>

                <FormItem>
                  <FormLabel className='[&:has([data-state=checked])>div]:border-primary'>
                    <FormControl>
                      <RadioGroupItem value='system' className='sr-only' />
                    </FormControl>
                    <div className='border-muted hover:border-accent items-center rounded-md border-2 p-1'>
                      <div className='space-y-2 rounded-sm bg-gradient-to-b from-[#ecedef] to-slate-950 p-2'>
                        <div className='space-y-2 rounded-md bg-white/80 p-2 shadow-xs'>
                          <div className='h-2 w-[80px] rounded-lg bg-[#ecedef]' />
                          <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                        </div>
                        <div className='flex items-center space-x-2 rounded-md bg-slate-800/80 p-2 shadow-xs'>
                          <div className='h-4 w-4 rounded-full bg-slate-400' />
                          <div className='h-2 w-[100px] rounded-lg bg-slate-400' />
                        </div>
                      </div>
                    </div>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='radius'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Radius</FormLabel>
              <FormDescription>
                Adjust the border radius of the interface elements.
              </FormDescription>
              <FormMessage />
              <div className='flex flex-col space-y-4'>
                <FormControl>
                  <div className='grid grid-cols-[1fr,80px] gap-4'>
                    <Slider
                      min={0}
                      max={1}
                      step={0.01}
                      value={[parseFloat(field.value)]}
                      onValueChange={(vals) => {
                        const value = vals[0].toString()
                        field.onChange(value)
                        setRadius(value)
                      }}
                    />
                  </div>
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        <div className='flex space-x-4'>
          <Button type='submit'>Update preferences</Button>
          <Button type='button' variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
