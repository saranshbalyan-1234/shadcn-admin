import { z } from 'zod'
import { useForm } from 'react-hook-form    // Save to localStorage and reload layout immediately
    localStorage.setItem('layout-config', JSON.stringify(data))
    
    // Force an immediate reload to update the layout
    reloadLayout()
    
    // Small delay before showing success message
    setTimeout(() => {
      toast({
        title: 'Layout updated',
        description: 'Your layout settings have been updated.',
      })
    }, 100) { zodResolver } from '@hookform/resolvers/zod'
import { layoutConfig } from '@/config/layout'
import { useLayout } from '@/context/layout-context'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

const layoutFormSchema = z.object({
  sidebarPosition: z.enum(['left', 'right']),
  sidebarVariant: z.enum(['floating', 'sidebar', 'inset']),
  sidebarCollapsible: z.enum(['icon', 'offcanvas', 'none']),
  showBreadcrumbs: z.boolean(),
  headerOptions: z.object({
    sticky: z.boolean(),
    showSearch: z.boolean(),
    showThemeSwitch: z.boolean(),
    showProfileMenu: z.boolean(),
  }),
})

type LayoutFormValues = z.infer<typeof layoutFormSchema>

export function LayoutForm() {
  const { reloadLayout, layout } = useLayout()

  const defaultValues: LayoutFormValues = {
    sidebarPosition: layout.sidebar.side,
    sidebarVariant: layout.sidebar.variant,
    sidebarCollapsible: layout.sidebar.collapsible,
    showBreadcrumbs: layout.sidebar.showBreadcrumbs,
    headerOptions: {
      sticky: layout.header.sticky,
      showSearch: layout.header.showSearch,
      showThemeSwitch: layout.header.showThemeSwitch,
      showProfileMenu: layout.header.showProfileMenu,
    },
  }

  const form = useForm<LayoutFormValues>({
    resolver: zodResolver(layoutFormSchema),
    defaultValues,
  })

  function onSubmit(data: LayoutFormValues) {
    // Save to localStorage first
    localStorage.setItem('layout-config', JSON.stringify(data))

    // Save to localStorage and reload layout
    localStorage.setItem('layout-config', JSON.stringify(data))
    reloadLayout()

    toast({
      title: 'Layout updated',
      description: 'Your layout settings have been updated.',
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='space-y-8'>
          {/* Sidebar Settings */}
          <div>
            <h3 className='text-base font-medium'>Sidebar Options</h3>
          </div>

          {/* Sidebar Position */}
          <FormField
            control={form.control}
            name='sidebarPosition'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sidebar Position</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select sidebar position' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='left'>Left</SelectItem>
                    <SelectItem value='right'>Right</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Sidebar Variant */}
          <FormField
            control={form.control}
            name='sidebarVariant'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sidebar Style</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select sidebar style' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='floating'>Floating</SelectItem>
                    <SelectItem value='sidebar'>Standard</SelectItem>
                    <SelectItem value='inset'>Inset</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Sidebar Collapsible */}
          <FormField
            control={form.control}
            name='sidebarCollapsible'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collapse Behavior</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select collapse behavior' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='icon'>Icon Only</SelectItem>
                    <SelectItem value='offcanvas'>Off Canvas</SelectItem>
                    <SelectItem value='none'>No Collapse</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Show Breadcrumbs */}
          <FormField
            control={form.control}
            name='showBreadcrumbs'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-base'>Show Breadcrumbs</FormLabel>
                  <FormDescription>
                    Display navigation breadcrumbs in the header
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Header Options */}
          <div className='space-y-4'>
            <h3 className='text-base font-medium'>Header Options</h3>

            <FormField
              control={form.control}
              name='headerOptions.sticky'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Sticky Header</FormLabel>
                    <FormDescription>
                      Keep the header fixed at the top while scrolling
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='headerOptions.showSearch'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Show Search</FormLabel>
                    <FormDescription>
                      Display the search bar in the header
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='headerOptions.showThemeSwitch'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      Show Theme Switch
                    </FormLabel>
                    <FormDescription>
                      Display the theme switcher in the header
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='headerOptions.showProfileMenu'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>
                      Show Profile Menu
                    </FormLabel>
                    <FormDescription>
                      Display the profile menu in the header
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type='submit'>Update layout</Button>
      </form>
    </Form>
  )
}
