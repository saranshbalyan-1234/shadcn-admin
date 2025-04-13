import ContentSection from '../components/content-section'
import { LayoutForm } from './layout-form'

export default function SettingsLayout() {
  return (
    <ContentSection
      title='Layout'
      desc='Customize the layout and appearance of the dashboard interface.'
    >
      <LayoutForm />
    </ContentSection>
  )
}
