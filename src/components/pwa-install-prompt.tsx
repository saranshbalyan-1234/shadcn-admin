import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'

// Interface for the BeforeInstallPromptEvent which is not part of standard DOM
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PwaInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isIos, setIsIos] = useState(false)

  useEffect(() => {
    // Check if the app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches

    // Detect iOS device
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

    // Set iOS flag for showing different installation instructions
    if (isIosDevice) {
      setIsIos(true)
    }

    if (isAppInstalled) {
      // App is already installed, don't show the prompt
      return
    }

    // Store the install prompt event for later use
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return

    // Show the install prompt
    await installPrompt.prompt()

    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice

    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    // We've used the prompt, and can't use it again, so clear it
    setInstallPrompt(null)
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <Card className="fixed bottom-4 right-4 z-50 max-w-sm shadow-lg">
      <CardHeader>
        <CardTitle>Install App</CardTitle>
        <CardDescription>
          Install Shadcn Admin for a better experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isIos ? (
          <div className="text-sm">
            Tap the share button <span className="inline-block">⎙</span> and select &quot;Add to Home Screen&quot; to install
          </div>
        ) : (
          <div className="text-sm">
            Install this app on your device for quick and easy access, even when offline.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={handleDismiss}>
          Dismiss
        </Button>
        {!isIos && (
          <Button onClick={handleInstallClick}>
            Install
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
