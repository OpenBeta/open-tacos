/**
 * next-auth signs out by ending the session and removing the session cookie.
 * However, it does not actually log out of auth0. Therefore, after logging out and then in the user will automatically be logged in again.
 * The default user experience here could be ok for providers such as facebook/google/etc but we want users to be able to log in with another account.
 */
import { NextRequest, NextResponse } from 'next/server'

const auth0Domain = process.env.AUTH0_DOMAIN ?? ''
const auth0ClientId = process.env.AUTH0_CLIENT_ID ?? ''

export async function GET (req: NextRequest): Promise<NextResponse> {
  const clientIdParam = `client_id=${auth0ClientId}`
  const referer = req.headers.get('referer')

  if (referer == null) {
    return NextResponse.redirect(`${auth0Domain}/v2/logout?${clientIdParam}`)
  } else {
    const returnTo = new URL(referer).origin
    return NextResponse.redirect(`${auth0Domain}/v2/logout?returnTo=${encodeURIComponent(returnTo)}&${clientIdParam}`)
  }
}
