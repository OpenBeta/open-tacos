import { NextRequest, NextResponse } from 'next/server'
import * as Auth0 from 'auth0'
import { auth0Client, isNullOrEmpty } from '@/js/auth/mobile'
import { withMobileAuth } from '@/js/auth/withMobileAuth'

/**
 * Mobile login handler
 */
async function postHandler (request: NextRequest): Promise<NextResponse> {
  let username: string, password: string
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
    response = await auth0Client.oauth.passwordGrant({
      username,
      password,
      scope: 'openid profile email offline_access',
      audience: 'https://api.openbeta.io',
      realm: 'Username-Password-Authentication'
    })

    return NextResponse.json({ data: response.data })
  } catch (error) {
    console.error('#### Auth0 error ####', error)
    return NextResponse.json({ error: 'Unexpected auth error', status: 403 })
  }
}

export const POST = withMobileAuth(postHandler)
