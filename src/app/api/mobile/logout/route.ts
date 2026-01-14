import { NextRequest, NextResponse } from 'next/server'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import { isNullOrEmpty } from '@/js/auth/mobile'
import { AUTH_CONFIG_SERVER } from '@/Config'

if (AUTH_CONFIG_SERVER == null) throw new Error('AUTH_CONFIG_SERVER not defined')

const { clientId, clientSecret, issuer } = AUTH_CONFIG_SERVER
const JWKS = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`))

/**
 * Verify the access token from Authorization header
 */
async function verifyAccessToken (request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization')
  if (authHeader == null || !authHeader.startsWith('Bearer ')) {
    return false
  }

  const token = authHeader.substring(7).trim()
  try {
    await jwtVerify(token, JWKS, {
      issuer: issuer + '/',
      audience: 'https://api.openbeta.io/'
    })
    return true
  } catch {
    return false
  }
}

/**
 * Mobile logout handler - revokes refresh token at Auth0
 */
export async function POST (request: NextRequest): Promise<NextResponse> {
  // Verify access token
  const isAuthenticated = await verifyAccessToken(request)
  if (!isAuthenticated) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid access token' },
      { status: 401 }
    )
  }

  // Parse request body
  let refreshToken: string
  try {
    const data = await request.json()
    refreshToken = data.refreshToken

    if (isNullOrEmpty(refreshToken)) {
      console.error('Empty refreshToken!')
      throw new Error('Invalid payload')
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid payload' },
      { status: 400 }
    )
  }

  // Revoke token at Auth0
  try {
    const response = await fetch(`${issuer}oauth/revoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        token: refreshToken
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('#### Auth0 revoke error ####', errorData)
      return NextResponse.json(
        { error: errorData },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('#### Auth0 revoke error ####', error)
    return NextResponse.json(
      { error: 'Failed to revoke token' },
      { status: 500 }
    )
  }
}
