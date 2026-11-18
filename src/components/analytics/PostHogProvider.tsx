'use client'
import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initAnalytics, trackEvent } from '@/js/analytics/posthog'

/**
 * Initializes privacy-friendly analytics and records a page view on every route change.
 * Renders nothing. Does nothing unless NEXT_PUBLIC_POSTHOG_KEY is set.
 */
export default function PostHogProvider (): JSX.Element {
  useEffect(() => {
    initAnalytics()
  }, [])

  return (
    <Suspense fallback={null}>
      <PageViewTracker />
    </Suspense>
  )
}

const PageViewTracker = (): null => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname == null) return
    initAnalytics()
    const query = searchParams?.toString() ?? ''
    trackEvent('$pageview', {
      $current_url: window.location.origin + pathname + (query !== '' ? `?${query}` : '')
    })
  }, [pathname, searchParams])

  return null
}
