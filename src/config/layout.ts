export const layoutConfig = {
  sidebar: {
    side: 'left' as 'left' | 'right',
    variant: 'floating' as 'floating' | 'sidebar' | 'inset',
    collapsible: 'icon' as 'icon' | 'offcanvas' | 'none',
    showBreadcrumbs: true,
  },
  header: {
    sticky: true,
    showSearch: true,
    showThemeSwitch: true,
    showProfileMenu: true,
  },
  breadcrumbs: {
    enabled: true,
    homeLabel: 'Home',
    separator: 'chevron' as 'chevron' | 'slash' | 'dot',
    capitalizeLabels: true,
    showIcons: true,
    maxItems: 0, // 0 means show all
    truncateLabels: false,
    truncateLength: 15,
  },
}
