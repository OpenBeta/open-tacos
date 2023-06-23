/*
* Wrap an API Route to check that the user has a valid session.
* If the user is not logged in the handler will return a 401 Unauthorized.
*/
import { NextApiHandler } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

const withAuth = (handler: NextApiHandler): NextApiHandler => {
  return async (req, res) => {
    const session = await getServerSession(req, res, authOptions)

    console.log('#withAuth', session)
    if (session != null) {
      await handler(req, res)
    } else {
      res.status(401).redirect(307, '/api/auth/signin')
    }
  }
}

export default withAuth
