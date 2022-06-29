import { NextApiHandler } from 'next'
import withAuth from '../withAuth'
import { getAllUsersMetadata } from '../../../js/auth/ManagementClient'

const handler: NextApiHandler<any> = async (req, res) => {
  try {
    const users = await getAllUsersMetadata(true)
    res.json(users)
  } catch (e) {
    res.status(200).redirect(401, '/')
  }
}

export default withAuth(handler)
