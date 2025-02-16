import { NextRequest, NextResponse } from 'next/server'
import * as Auth0 from 'auth0'
import { auth0Client, isNullOrEmpty } from '@/js/auth/mobile'
import { withMobileAuth } from '@/js/auth/withMobileAuth'
import { errorHandler } from '../login/errorHandler'

/**
 * Mobile refresh token handler
 */
async function postHandler (request: NextRequest): Promise<any> {
  let refreshToken: string
  try {
    const data = await request.json()
    refreshToken = data.refreshToken

    if (isNullOrEmpty(refreshToken)) {
      console.error('Empty refreshToken!')
      throw new Error('Invalid payload')
    }
  } catch (error) {
    return NextResponse.json({ error: 'Unexpected error', status: 400 })
  }

  let response: Auth0.JSONApiResponse<Auth0.TokenSet> | undefined
  try {
    response = await auth0Client.oauth.refreshTokenGrant({
      refresh_token: refreshToken,
      audience: 'https://api.openbeta.io'
    })

    return NextResponse.json({ ...response.data }, { status: response.status })
  } catch (error) {
    return errorHandler(error)
  }
}

export const POST = withMobileAuth(postHandler)
