/*
* Wrap an API Route to check that the user has a valid session.
* If the user is not logged in the handler will return a 401 Unauthorized.
*/
import { getSession } from 'next-auth/react'
import { NextApiHandler } from 'next'

const withAuth = (handler: NextApiHandler): NextApiHandler => {
  return async (req, res) => {
    const session = await getSession({ req })
    if (session != null) {
      handler(req, res)
    } else {
      res.status(401).end()
    }
  }
}

export default withAuth
