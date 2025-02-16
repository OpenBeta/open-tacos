import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

type Next13APIHandler = (req: NextRequest) => Promise<any>

/*
* A high-order function to protect Next 13 (and later) API route
* by checking that the user has a valid session.
*/
export const withUserAuth = (handler: Next13APIHandler): Next13APIHandler => {
  return async (req: NextRequest) => {
    const session = await getServerSession({ req, ...authOptions })
    if (session != null) {
      // Passing useful session data downstream
      req.headers.set(PREDEFINED_HEADERS.user_uuid, session.user.metadata.uuid)
      req.headers.set(PREDEFINED_HEADERS.auth0_id, session.id)
      req.headers.set(PREDEFINED_HEADERS.access_token, session.accessToken)
      return await handler(req)
    } else {
      return NextResponse.json({ status: 401 })
    }
  }
}

export enum PREDEFINED_HEADERS {
  user_uuid = 'x-openbeta-user-uuid',
  auth0_id = 'x-auth0-userid', // Example: 'auth0|1237492749372923498234'
  access_token = 'x-auth0-access-token' // JWT token
}
