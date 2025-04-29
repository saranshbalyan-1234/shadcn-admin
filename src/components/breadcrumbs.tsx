import React from 'react'
import { Link, useMatches } from '@tanstack/react-router'
import { ChevronRight,Home } from 'lucide-react'

export function Breadcrumbs() {
  const matches = useMatches()
  const breadcrumbs = matches
    .filter((match) => match.pathname !== '/')
    .map(match => {
      // Remove leading underscore and get the last meaningful segment
      const segments = match.routeId.split('/').filter(segment => 
        segment && !segment.startsWith('_') && !segment.startsWith('(')
      )
      const name = segments[segments.length - 1]
      
      return {
        path: match.pathname,
        name: name
          ? name.charAt(0).toUpperCase() + name.slice(1).replace(/[-_]/g, ' ')
          : ''
      }
    })
    .filter(crumb => crumb.name) // Remove empty names

  if (breadcrumbs.length <= 0) return null

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link to="/" className="hover:text-foreground transition-colors">
        <Home size={14}/>
      </Link>
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          <ChevronRight className="h-4 w-4" />
          <Link 
            to={breadcrumb.path}
            className={`${
              index === breadcrumbs.length - 1
                ? 'text-foreground font-medium'
                : 'hover:text-foreground transition-colors'
            }`}
          >
            {breadcrumb.name}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  )
}
