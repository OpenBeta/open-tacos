/**
 * @jest-environment jsdom
 */
jest.mock('posthog-js', () => ({ __esModule: true, default: { init: jest.fn(), capture: jest.fn() } }))

describe('analytics', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  it('is a no-op when no project key is set', async () => {
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY
    const posthog = (await import('posthog-js')).default
    const { initAnalytics, trackEvent, isAnalyticsEnabled } = await import('../posthog')
    initAnalytics()
    trackEvent('search_opened')
    expect(isAnalyticsEnabled()).toBe(false)
    expect(posthog.init).not.toHaveBeenCalled()
    expect(posthog.capture).not.toHaveBeenCalled()
  })

  it('initializes cookieless and captures events when a key is set', async () => {
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'phc_test'
    const posthog = (await import('posthog-js')).default
    const { initAnalytics, trackEvent } = await import('../posthog')
    initAnalytics()
    initAnalytics()
    expect(posthog.init).toHaveBeenCalledTimes(1)
    expect((posthog.init as jest.Mock).mock.calls[0][1]).toMatchObject({
      persistence: 'memory',
      autocapture: false,
      api_host: 'https://eu.i.posthog.com'
    })
    trackEvent('search_opened', { variant: 'XSearch' })
    expect(posthog.capture).toHaveBeenCalledWith('search_opened', { variant: 'XSearch' })
  })
})
