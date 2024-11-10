import { NextRequest, NextResponse } from 'next/server'
import * as Auth0 from 'auth0'

import { AUTH_CONFIG_SERVER } from '../../../../Config'

if (AUTH_CONFIG_SERVER == null) throw new Error('AUTH_CONFIG_SERVER not defined')

const mobileAuthSecret = process.env.MOBILE_AUTH_SECRET
if (mobileAuthSecret == null) {
  console.warn('Mobile auth secret not found')
}

const { clientSecret, clientId, issuer } = AUTH_CONFIG_SERVER

// Set up Auth0 client
const auth = new Auth0.AuthenticationClient({
  domain: issuer.replace('https://', ''),
  clientId,
  clientSecret
})

/**
 * Mobile login handler
 */
export async function POST (request: NextRequest): Promise<any> {
  const authHeader = request.headers.get('User-Agent')
  if (mobileAuthSecret != null && authHeader !== mobileAuthSecret) {
    return NextResponse.json({ message: 'Unauthorized', status: 401 })
  }

  let username, password: string
  try {
    const data = await request.json()
    username = data.username
    password = data.password

    if (isNullOrEmpty(username) || isNullOrEmpty(password)) {
      console.error('Empty username/password!')
      throw new Error('Invalid payload')
    }
  } catch (error) {
    return NextResponse.json({ error: 'Unexpected error', status: 400 })
  }

  let response: Auth0.JSONApiResponse<Auth0.TokenSet> | undefined
  try {
    response = await auth.oauth.passwordGrant({
      username,
      password,
      scope: 'openid profile email offline_access',
      audience: 'https://api.openbeta.io'
    })

    return NextResponse.json({ data: response.data })
  } catch (error) {
    console.error('#### Auth0 error ####', error)
    return NextResponse.json({ error: 'Unexpected auth error', status: 403 })
  }
}

function isNullOrEmpty (str: string | null | undefined): boolean {
  return str == null || str?.trim() === ''
}
