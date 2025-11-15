import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'
import { AUTH_CONFIG_SERVER } from '@/Config'
import { sendEmailVerification } from '@/js/auth/ManagementClient'

if (AUTH_CONFIG_SERVER == null) throw new Error('AUTH_CONFIG_SERVER not defined')

const { nextauthSecret } = AUTH_CONFIG_SERVER

/**
 * JWT-verify 'session_token' from Auth0 postLogin action. The userId to request new email verification
 * is in the JWT payload. We want to make sure the token really comes from Auth0.
 * - GET: verify only
 * - POST: verify and send a verification email for the user.
 * @param endpoint /api/user/emailVerification?token=<Auth0 session_token>
 */
const verify = async (req: NextRequest): Promise<any> => {
  const jwt = req.nextUrl.searchParams.get('token')
  if (jwt != null) {
    return await jose.jwtVerify(jwt, Buffer.from(nextauthSecret))
  }
}

export async function GET (req: NextRequest): Promise<NextResponse> {
  try {
    await verify(req)
    return new NextResponse(null, { status: 200 })
  } catch {
    return new NextResponse(null, { status: 503 })
  }
}

export async function POST (req: NextRequest): Promise<NextResponse> {
  try {
    const token = await verify(req)
    const auth0UserId = token.payload.sub
    await sendEmailVerification(auth0UserId)
    return new NextResponse(null, { status: 200 })
  } catch {
    return new NextResponse(null, { status: 503 })
  }
}
