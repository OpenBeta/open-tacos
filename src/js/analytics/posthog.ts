import posthog from 'posthog-js'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com'

let initialized = false

/**
 * Whether analytics is configured. When no project key is set (local dev, forks, CI)
 * analytics is a complete no-op.
 */
export const isAnalyticsEnabled = (): boolean =>
  typeof window !== 'undefined' && POSTHOG_KEY != null && POSTHOG_KEY !== ''

/**
 * Initialize PostHog with a privacy-friendly (cookieless, GDPR-friendly) config.
 * Safe to call multiple times.
 */
export const initAnalytics = (): void => {
  if (initialized || !isAnalyticsEnabled()) return
  posthog.init(POSTHOG_KEY as string, {
    api_host: POSTHOG_HOST,
    // No cookies/localStorage: nothing is stored on the visitor's device
    persistence: 'memory',
    // Only send the events we explicitly choose (stay within the free tier)
    autocapture: false,
    capture_pageview: false, // we capture page views manually on route change
    capture_pageleave: false,
    disable_session_recording: true,
    respect_dnt: true
  })
  initialized = true
}

/**
 * Track a custom event. No-op unless analytics is configured.
 */
export const trackEvent = (name: string, properties?: Record<string, unknown>): void => {
  if (!initialized) return
  posthog.capture(name, properties)
}
