import { NextApiHandler } from 'next'

import withAuth from '../withAuth'
import { doesUserNameExist } from '../../../js/auth/ManagementClient'

/**
 * Endpoint: /api/user/exists?nick=<username to check>
 * @returns data { found: boolean}
 */
const handler: NextApiHandler<any> = async (req, res) => {
  if (req.query?.nick as string == null) {
    res.status(400).json({ error: 'Missing \'nick\' in query string' })
  }

  try {
    const found = await doesUserNameExist((req.query?.nick as string).toLowerCase())
    if (found) {
      res.status(200).json({ found: true })
    } else {
      res.status(200).json({ found: false })
    }
  } catch (e) {
    res.status(500).json({ error: 'Can\'t verify whether the user name exists.  Don\'t allow the user to use this name' })
  }
}

export default withAuth(handler)
