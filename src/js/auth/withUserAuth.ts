import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { createRemoteJWKSet, jwtVerify, JWTVerifyGetKey } from 'jose'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { AUTH_CONFIG_SERVER } from '@/Config'

type Next13APIHandler = (req: NextRequest) => Promise<any>

const CustomClaimsNS = 'https://tacos.openbeta.io/'
const CustomClaimUserMetadata = CustomClaimsNS + 'user_metadata'

// Create JWKS client for Auth0 token verification (server-side only)
if (AUTH_CONFIG_SERVER == null) {
  throw new Error('AUTH_CONFIG_SERVER not available')
}
const issuer = AUTH_CONFIG_SERVER.issuer
const clientId = AUTH_CONFIG_SERVER.clientId
const JWKS: JWTVerifyGetKey = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`))

/*
* A high-order function to protect Next 13 (and later) API route
* by checking that the user has a valid session or a valid Bearer token.
*/
export const withUserAuth = (handler: Next13APIHandler): Next13APIHandler => {
  return async (req: NextRequest) => {
    // First, try cookie-based session (web browser)
    const session = await getServerSession({ req, ...authOptions })
    if (session != null) {
      // Passing useful session data downstream
      req.headers.set(PREDEFINED_HEADERS.user_uuid, session.user.metadata.uuid)
      req.headers.set(PREDEFINED_HEADERS.auth0_id, session.id)
      req.headers.set(PREDEFINED_HEADERS.access_token, session.accessToken)
      return await handler(req)
    }

    // No cookie session - check for Authorization header (mobile app)
    const authHeader = req.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ') === true) {
      const token = authHeader.substring(7).trim()
      try {
        const { payload } = await jwtVerify(token, JWKS, {
          issuer: issuer + '/',
          audience: [
            'https://api.openbeta.io/', // Access token (web)
            clientId // ID token (mobile client ID)
          ]
        })

        // Extract user metadata from id_token claims
        const userMetadata = payload[CustomClaimUserMetadata] as { uuid?: string, nick?: string } | undefined
        const uuid = userMetadata?.uuid

        if (uuid == null) {
          return NextResponse.json(
            { error: 'Unauthorized - Missing user UUID in token' },
            { status: 401 }
          )
        }

        // Set headers for downstream handlers
        req.headers.set(PREDEFINED_HEADERS.user_uuid, uuid)
        req.headers.set(PREDEFINED_HEADERS.auth0_id, payload.sub ?? '')
        req.headers.set(PREDEFINED_HEADERS.access_token, token)
        return await handler(req)
      } catch (error) {
        console.error('JWT verification failed:', error)
        return NextResponse.json(
          { error: 'Unauthorized - Invalid token' },
          { status: 401 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Unauthorized - Authentication required' },
      { status: 401 }
    )
  }
}

export enum PREDEFINED_HEADERS {
  user_uuid = 'x-openbeta-user-uuid',
  auth0_id = 'x-auth0-userid', // Example: 'auth0|1237492749372923498234'
  access_token = 'x-auth0-access-token' // JWT token
}
