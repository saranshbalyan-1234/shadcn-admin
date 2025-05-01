// import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router';
import { Check, Moon, Sun, Computer, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';
import type { Theme } from '@/context/theme-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  /* Update theme-color meta tag
   * when theme is updated */
  // useEffect(() => {
  //   const themeColor = theme === 'dark' ? '#020817' : '#fff'
  //   const metaThemeColor = document.querySelector("meta[name='theme-color']")
  //   if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor)

  //   // Sync the dark class with the current theme state
  //   const root = window.document.documentElement
  //   const isDark =
  //     theme === 'dark' ||
  //     (theme === 'system' &&
  //       window.matchMedia('(prefers-color-scheme: dark)').matches)
  //   root.classList.toggle('dark', isDark)
  // }, [theme])

  const handleTheme = (theme: Theme) => {
    setTheme(theme)
    localStorage.setItem('theme-mode', theme)
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='scale-95 rounded-full'>
          <Sun className='size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
          <Moon className='absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => handleTheme('light')} className="flex items-center gap-2">
          <Sun className="size-4" />
          Light
          <Check
            size={14}
            className={cn('ml-auto', theme !== 'light' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleTheme('dark')} className="flex items-center gap-2">
          <Moon className="size-4" />
          Dark
          <Check
            size={14}
            className={cn('ml-auto', theme !== 'dark' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleTheme('system')} className="flex items-center gap-2">
          <Computer className="size-4" />
          System
          <Check
            size={14}
            className={cn('ml-auto', theme !== 'system' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: '/settings/appearance' })} className="flex items-center gap-2">
          <Settings className="size-4" />
          More
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}