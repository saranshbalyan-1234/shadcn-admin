import React from 'react';
import { Link, useMatches } from '@tanstack/react-router';
import { Home } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSidebar } from '@/components/ui/sidebar';


export function Breadcrumbs() {
  const [open, setOpen] = React.useState(false)
  const { isMobile } = useSidebar()
  const isDesktop = !isMobile

  const matches = useMatches()
  const breadcrumbs = matches
    .filter((match) => match.pathname !== '/')
    .map((match) => {
      // Remove leading underscore and get the last meaningful segment
      const segments = match.routeId
        .split('/')
        .filter(
          (segment) =>
            segment && !segment.startsWith('_') && !segment.startsWith('(')
        )
      const name = segments[segments.length - 1]

      return {
        path: match.pathname,
        name: name
          ? name.charAt(0).toUpperCase() + name.slice(1).replace(/[-_]/g, ' ')
          : '',
      }
    })
    .filter((crumb) => crumb.name) // Remove empty names

  if (breadcrumbs.length <= 0) return null

  const ITEMS_TO_DISPLAY = isDesktop ? 2 :1
  const shouldShowDropdown = breadcrumbs.length > ITEMS_TO_DISPLAY

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to='/'>
              <Home className='h-4 w-4' />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {shouldShowDropdown && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isDesktop ? (
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger
                    className="flex items-center gap-1"
                    aria-label="Toggle menu"
                  >
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {breadcrumbs.slice(0, -ITEMS_TO_DISPLAY).map((crumb) => (
                      <DropdownMenuItem key={crumb.path}>
                        <Link to={crumb.path}>
                          {crumb.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerTrigger aria-label="Toggle Menu">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="text-left">
                      <DrawerTitle>Navigate to</DrawerTitle>
                      <DrawerDescription>
                        Select a page to navigate to.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="grid gap-1 px-4">
                      {breadcrumbs.slice(0, -ITEMS_TO_DISPLAY).map((crumb) => (
                        <Link
                          key={crumb.path}
                          to={crumb.path}
                          className="py-1 text-sm"
                        >
                          {crumb.name}
                        </Link>
                      ))}
                    </div>
                    <DrawerFooter className="pt-4">
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </BreadcrumbItem>
          </>
        )}
        {breadcrumbs.slice(-ITEMS_TO_DISPLAY).map((breadcrumb, index, array) => (
          <React.Fragment key={breadcrumb.path}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === array.length - 1 ? (
                <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
                  {breadcrumb.name}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild className="max-w-20 truncate md:max-w-none">
                  <Link to={breadcrumb.path}>{breadcrumb.name}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}