'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateMonsterState } from '@/actions/monsters.actions'

export default function SwRegister (): null {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    let mounted = true

    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('[client] Service worker registered', reg)

        const startLog = (): void => {
          if (navigator.serviceWorker.controller != null) {
            navigator.serviceWorker.controller.postMessage({ type: 'START_LOG' })
          }
        }

        if (reg.active != null) {
          startLog()
        } else {
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!mounted) return
            if (navigator.serviceWorker.controller != null) startLog()
          })
        }
      })
      .catch(err => {
        console.error('[client] SW registration failed', err)
      })

    // Listen for messages from the service worker (e.g. UPDATE_MONSTER_STATE)

    const handleSWMessage = (event: MessageEvent): void => {
      // Wrap async work in an IIFE to avoid returning a Promise to the event system
      void (async () => {
        try {
          const data = event.data as Record<string, unknown> | null
          if (data === null || data === undefined) return
          if (data.type === 'UPDATE_MONSTER_STATE') {
            // Determine current creature id from the URL: /creature/:id
            try {
              const pathname = String(window.location.pathname)
              const parts = pathname.split('/').filter(Boolean)
              const creatureIndex = parts.indexOf('creature')
              const id = (creatureIndex !== -1 && parts.length > creatureIndex + 1)
                ? String(parts[creatureIndex + 1])
                : ''

              if (id === '' || id === null) {
                // Not on a creature page -> nothing to update
                return
              }

              // Call the server action which updates the monster state
              try {
                await updateMonsterState(id)
                // After the server action completes, refresh server components to pick up new state
                try {
                  router.refresh()
                } catch (err) {
                  console.warn('[client] router.refresh failed', err)
                }
              } catch (err) {
                console.error('[client] updateMonsterState action failed', err)
              }
            } catch (err) {
              console.error('[client] failed to determine monster id or call API', err)
            }
          }
        } catch (err) {
          console.error('[client] handleSWMessage error', err)
        }
      })()
    }

    // Attach message listeners on navigator.serviceWorker and window as a fallback
    navigator.serviceWorker.addEventListener('message', handleSWMessage)
    window.addEventListener('message', handleSWMessage)

    const stopLog = (): void => {
      try {
        if (navigator.serviceWorker.controller != null) {
          navigator.serviceWorker.controller.postMessage({ type: 'STOP_LOG' })
        }
      } catch (err) {
        // ignore
      }
    }

    const onBeforeUnload = (): void => {
      stopLog()
    }

    const onPageHide = (): void => {
      stopLog()
    }

    const onVisibilityChange = (): void => {
      if (document.visibilityState === 'hidden') stopLog()
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    window.addEventListener('pagehide', onPageHide)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      mounted = false
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.removeEventListener('pagehide', onPageHide)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      // detach message listeners
      try {
        navigator.serviceWorker.removeEventListener('message', handleSWMessage)
        window.removeEventListener('message', handleSWMessage)
      } catch (err) {
        // ignore
      }
      // ensure we ask SW to stop when component unmounts
      stopLog()
    }
  }, [])

  return null
}
