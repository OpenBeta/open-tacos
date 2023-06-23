import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

import withAuth from '../withAuth'
import { updateUser } from '../../../js/auth/ManagementClient'
import { UserRole } from '../../../js/types'
import { IUserMetadataOriginal } from '../../../js/types/User'
import { authOptions } from '../auth/[...nextauth]'

const handler: NextApiHandler<any> = async (req, res) => {
  try {
    switch (req.method) {
      case 'POST':
        await handlePostRequest(req, res)
        break
      default:
        res.status(405).json({ error: 'Unexpected HTTP method for /api/basecamp/user' })
        break
    }
  } catch (e) {
    console.log('/api/basecamp/user', e)
    res.status(200).redirect(401, '/')
  }
}

/**
 * For admins to update user data from Basecamp. Does not support
 * creation of new users (hence userId required).
 * @param req
 * @param res
 * @returns
 */
async function handlePostRequest (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await getServerSession(req, res, authOptions)
  if (session?.user.metadata?.roles?.includes(UserRole.USER_ADMIN) ?? false) {
    res.setHeader('Cache-Control', 'no-store')
    const userId = req.query?.userId
    if (userId == null) {
      res.status(400).json({ error: 'Missing \'userId\' in query string' })
      return
    }
    if (Array.isArray(userId)) {
      res.status(400).json({ error: '\'userId\' should only be supplied once in query string' })
      return
    }

    const payload: Partial<IUserMetadataOriginal> = {}
    const orgAdminOrgIds = req.query?.orgAdminOrgIds
    if (typeof orgAdminOrgIds === 'string') {
      payload.orgAdminOrgIds = [orgAdminOrgIds]
    } else if (Array.isArray(orgAdminOrgIds)) {
      payload.orgAdminOrgIds = orgAdminOrgIds
    } else {
      // orgAdminOrgIds undefined, likely because not supplied in req.
    }

    if (Object.keys(payload).length === 0) {
      res.status(400).json({ error: 'No data to update' })
    }
    const user = await updateUser(userId, payload)
    res.json(user)
  } else {
    res.status(401).end()
  }
}

export default withAuth(handler)
