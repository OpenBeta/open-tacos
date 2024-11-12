import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from 'pages/api/auth/[...nextauth]'

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
      req.headers.set('x-openbeta-user-uuid', session.user.metadata.uuid)
      req.headers.set('x-auth0-userid', session.id)
      return await handler(req)
    } else {
      return NextResponse.json({ status: 401 })
    }
  }
}
