import { getSession } from 'next-auth/react'

/**
 * Get a current access token for an API call from the browser.
 *
 * The token captured by `useSession()` at render time expires after a short
 * time and is only refreshed when the session is re-fetched (window focus or reload).
 * `getSession()` re-fetches `/api/auth/session`, which runs the `jwt` callback
 * and refreshes the token if needed.
 *
 * @param fallbackToken previous token (one already in use by the browser), used if the session can't be fetched
 */
export const getFreshAccessToken = async (fallbackToken: string = ''): Promise<string> => {
  try {
    const session = await getSession()
    return session?.accessToken ?? fallbackToken
  } catch {
    return fallbackToken
  }
}
