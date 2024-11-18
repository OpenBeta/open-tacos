import { NextRequest, NextResponse } from 'next/server'

const mobileAuthSecret = process.env.MOBILE_AUTH_SECRET

type Next13ApiHandler = (req: NextRequest) => Promise<NextResponse>

/**
 * A high-order function to protect mobile-related auth endpoints.
 * Do not use elsewhere.
 */
export const withMobileAuth = (handler: Next13ApiHandler): Next13ApiHandler => {
  return async function (request: NextRequest) {
    if (request.method !== 'POST') {
      return NextResponse.json({ message: 'Must send POST request' }, { status: 405 })
    }
    const authHeader = request.headers.get('Secret')
    if (mobileAuthSecret != null && authHeader === mobileAuthSecret) {
      return await handler(request)
    }
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
}
