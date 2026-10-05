import { getSession } from 'next-auth/react'

/**
 * Get a current access token for an API call from the browser.
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
