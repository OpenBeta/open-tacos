import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import withAuth from '../withAuth'
import { getUserRoles, setUserRoles } from '../../../js/auth/ManagementClient'
import { UserRole } from '../../../js/types'

const handler: NextApiHandler<any> = async (req, res) => {
  try {
    const session = await getSession({ req })
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
      switch (req.method) {
        case 'GET':
          await handleGetRequest(req, res)
          break
        case 'POST':
          await handlePostRequest(req, res)
          break
        default:
          res.status(405).json({ error: 'Unexpected HTTP method for /api/basecamp/user' })
          break
      }
    } else {
      res.status(401).end()
    }
  } catch (e) {
    console.log('/api/basecamp/userRoles', e)
    res.status(200).redirect(401, '/')
  }
}

async function handleGetRequest (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const rolesResp = await getUserRoles(req.query.userId as string)
  res.json(rolesResp)
}

async function handlePostRequest (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let roles = req.query?.roles
  if (roles == null) {
    res.status(400).json({ error: 'Missing \'roles\' in query string' })
    return
  }
  if (!Array.isArray(roles)) {
    roles = [roles]
  }
  await setUserRoles(req.query.userId as string, roles)
  res.status(200).end()
}

export default withAuth(handler)
