import { createLazyFileRoute } from '@tanstack/react-router'
import SettingsLayout from '@/features/settings/layout'

export const Route = createLazyFileRoute('/_authenticated/settings/layout')({
  component: SettingsLayout,
})
