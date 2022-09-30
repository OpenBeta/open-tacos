import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'
import withAuth from '../withAuth'
import { getAllUsersMetadata } from '../../../js/auth/ManagementClient'

const handler: NextApiHandler<any> = async (req, res) => {
  try {
    const session = await getSession({ req })
    if (session?.user.metadata?.roles?.includes('user_admin') ?? false) {
      const users = await getAllUsersMetadata(true)
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
