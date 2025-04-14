import React, { createContext, useContext, useEffect, useState } from 'react'
import { layoutConfig } from '@/config/layout'

interface LayoutContextType {
  reloadLayout: () => void
  layout: typeof layoutConfig
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [layout, setLayout] = useState(layoutConfig)

  const loadLayoutFromStorage = () => {
    const savedLayout = localStorage.getItem('layout-config')
    if (savedLayout) {
      const layoutData = JSON.parse(savedLayout)
      // Create new config with saved values
      const newConfig = {
        ...layoutConfig,
        sidebar: {
          ...layoutConfig.sidebar,
          side: layoutData.sidebarPosition,
          variant: layoutData.sidebarVariant,
          collapsible: layoutData.sidebarCollapsible,
          showBreadcrumbs: layoutData.showBreadcrumbs,
        },
        header: {
          ...layoutConfig.header,
          sticky: layoutData.headerOptions.sticky,
          showSearch: layoutData.headerOptions.showSearch,
          showThemeSwitch: layoutData.headerOptions.showThemeSwitch,
          showProfileMenu: layoutData.headerOptions.showProfileMenu,
        },
      }

      // Update state which will cause re-renders
      setLayout(newConfig)
    }
  }

  // Load layout settings on mount
  useEffect(() => {
    loadLayoutFromStorage()
  }, [])

  // Force re-render when layout changes
  useEffect(() => {
    const savedLayout = localStorage.getItem('layout-config')
    if (savedLayout) {
      loadLayoutFromStorage()
    }
  }, [])

  const value = React.useMemo(
    () => ({
      reloadLayout: loadLayoutFromStorage,
      layout,
    }),
    [layout]
  )

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  )
}

const useLayout = () => {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}

export { LayoutProvider, useLayout }
