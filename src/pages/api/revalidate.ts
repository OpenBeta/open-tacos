import { NextApiRequest, NextApiHandler } from 'next'
import withAuth from './withAuth'
import { checkUsername } from '../../js/utils'

/**
 * Notify backend to regenerate user profile page
 */
const handler: NextApiHandler = async (req: NextApiRequest, res) => {
  try {
    const username = req.query?.u as string
    if (!checkUsername(username)) {
      throw new Error('Invalid username: ' + username)
    }
    await res.revalidate(`/u/${encodeURIComponent(username)}`)
    return res.json({ revalidated: true })
  } catch (err) {
    console.log(err)
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating')
  }
}

export default withAuth(handler)
