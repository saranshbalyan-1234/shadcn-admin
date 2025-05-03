import React from 'react'
import { cn } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { PwaInstallPrompt } from '@/components/pwa-install-prompt'

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Main = ({ fixed, ...props }: MainProps) => {
  return (
    <>
      <Header />
      <main
        className={cn(
          'peer-[.header-fixed]/header:mt-16',
          'px-4 py-6',
          fixed && 'fixed-main flex grow flex-col overflow-hidden'
        )}
        {...props}
      />
      <PwaInstallPrompt />
    </>
  )
}

Main.displayName = 'Main'
