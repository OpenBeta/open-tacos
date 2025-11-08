import { useEffect } from 'react'

/**
 * Locks body scroll when active, restores it on cleanup.
 * Uses position: fixed technique for better mobile browser support.
 * Useful for modals and drawers.
 */
export function useBodyScrollLock (isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked) return

    // Get current scroll position
    const scrollY = window.scrollY
    const body = document.body

    // Lock scroll by fixing body position
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    body.style.overflow = 'hidden'

    return () => {
      // Restore scroll
      body.style.position = ''
      body.style.top = ''
      body.style.width = ''
      body.style.overflow = ''

      // Restore scroll position
      window.scrollTo(0, scrollY)
    }
  }, [isLocked])
}
