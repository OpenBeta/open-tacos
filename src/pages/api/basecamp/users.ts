import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'
import withAuth from '../withAuth'
import { getAllUsersMetadata } from '../../../js/auth/ManagementClient'
import { UserRole } from '../../../js/types'

const handler: NextApiHandler<any> = async (req, res) => {
  try {
    const session = await getSession({ req })
    if (session?.user.metadata?.roles?.includes(UserRole.USER_ADMIN) ?? false) {
      res.setHeader('Cache-Control', 'no-store')
      const page = req.query?.page ?? 1
      const type = req.query?.type ?? 'auth0'
      const email = Array.isArray(req.query?.email) ? req.query.email[0] : req.query?.email
      const params = {
        page: parseInt(page as string),
        connectionType: type as ('auth0' | 'email'),
        email
      }
      const users = await getAllUsersMetadata(params)
      res.json(users)
    } else {
      res.status(401).end()
    }
  } catch (e) {
    console.log('/api/basecamp/users', e)
    res.status(200).redirect(401, '/')
  }
}

export default withAuth(handler)
