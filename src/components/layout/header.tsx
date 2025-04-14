import React from 'react'
import { cn } from '@/lib/utils'
import { useLayout } from '@/context/layout-context'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
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
  // const [offset, setOffset] = React.useState(0)
  const { layout } = useLayout()
  const { isMobile } = useSidebar()
  const { showSearch, showThemeSwitch, showProfileMenu, sticky } = layout.header
  console.log('saransh', layout)
  const { showBreadcrumbs, collapsible } = layout.sidebar

  return (
    <header
      className={cn(
        'flex h-16 items-center gap-3 bg-sidebar p-4 sm:gap-4',
        sticky && 'header-fixed peer/header fixed z-50 w-[inherit]',
        'border-b border-sidebar-border',
        className
      )}
      {...props}
    >
      {collapsible !== 'none' || isMobile ? (
        <>
          <SidebarTrigger
            variant='outline'
            className='scale-125 sm:scale-100'
          />
          <Separator orientation='vertical' className='h-6' />
        </>
      ) : (
        <></>
      )}

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
