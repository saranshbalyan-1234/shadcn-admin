import React from 'react'
import { cn } from '@/lib/utils'
import { useLayout } from '@/context/layout-context'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Header = ({
  className,
  fixed,
  children,
  ...props
}: HeaderProps) => {
  const [offset, setOffset] = React.useState(0)
  const { layout } = useLayout()
  const { showSearch, showThemeSwitch, showProfileMenu, sticky } = layout.header
  console.log("saransh",layout)
  const { showBreadcrumbs } = layout.sidebar

  // Use the sticky prop from layout context if fixed prop is not provided
  const isFixed = fixed ?? sticky

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }
    document.addEventListener('scroll', onScroll, { passive: true })
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'flex h-16 items-center gap-3 bg-background p-4 sm:gap-4',
        isFixed && 'header-fixed peer/header fixed z-50 w-[inherit] rounded-md',
        offset > 10 && isFixed ? 'shadow' : 'shadow-none',
        className
      )}
      {...props}
    >
      <SidebarTrigger variant='outline' className='scale-125 sm:scale-100' />
      <Separator orientation='vertical' className='h-6' />

      {/* Left section with breadcrumbs */}
      {showBreadcrumbs && (
        <div className='hidden md:block'>
          <Breadcrumbs />
        </div>
      )}

      {children}

      {/* Right section with search, theme, profile */}
      <div className='ml-auto flex items-center gap-4'>
        {showSearch && <Search />}
        {showThemeSwitch && <ThemeSwitch />}
        {showProfileMenu && <ProfileDropdown />}
      </div>
    </header>
  )
}

Header.displayName = 'Header'
