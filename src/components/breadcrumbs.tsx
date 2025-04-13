import { Link, useLocation } from '@tanstack/react-router'
import { layoutConfig } from '@/config/layout'
import { ChevronRight, Circle, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Breadcrumbs() {
  const location = useLocation()
  const {
    enabled,
    homeLabel,
    separator,
    capitalizeLabels,
    showIcons,
    maxItems,
    truncateLabels,
    truncateLength,
  } = layoutConfig.breadcrumbs

  if (!enabled) return null

  const pathSegments = location.pathname.split('/').filter(Boolean)
  const displaySegments =
    maxItems > 0 ? pathSegments.slice(-maxItems) : pathSegments

  const getSeparator = () => {
    switch (separator) {
      case 'slash':
        return <span className='text-muted-foreground/40'>/</span>
      case 'dot':
        return <Circle className='h-1.5 w-1.5 text-muted-foreground/40' />
      default:
        return <ChevronRight className='h-4 w-4 text-muted-foreground/40' />
    }
  }

  const formatLabel = (label: string) => {
    let formatted = label
    if (capitalizeLabels) {
      formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1)
    }
    if (truncateLabels && formatted.length > truncateLength) {
      formatted = formatted.slice(0, truncateLength) + '...'
    }
    return formatted
  }

  return (
    <nav className='flex items-center space-x-1 text-sm text-muted-foreground'>
      <Link
        to='/'
        className={cn(
          'flex items-center hover:text-foreground',
          showIcons && 'gap-1'
        )}
      >
        {showIcons && <Home className='h-3 w-3' />}
        <span>{homeLabel}</span>
      </Link>

      {displaySegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, pathSegments.indexOf(segment) + 1).join('/')}`
        const isLast = index === displaySegments.length - 1

        return (
          <span key={path} className='flex items-center space-x-1'>
            {getSeparator()}
            {isLast ? (
              <span className='text-foreground'>{formatLabel(segment)}</span>
            ) : (
              <Link to={path} className='hover:text-foreground'>
                {formatLabel(segment)}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
