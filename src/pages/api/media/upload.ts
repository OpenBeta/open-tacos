import getRawBody from 'raw-body'
import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'

import withAuth from '../withAuth'
import { upload } from '../../../js/sirv/SirvClient'

// We need to disable the default body parser
export const config = {
  api: {
    bodyParser: false
  }
}

const handler: NextApiHandler<any> = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const session = await getSession({ req })

      if (req.query?.filename == null) {
        throw new Error('Missing filename query param')
      }

      if (session?.user?.metadata?.uuid == null) {
        throw new Error('Missing user metadata')
      }

      const { filename } = req.query
      const { uuid } = session.user.metadata
      const fullFilename = `/u/${uuid}/${filename as string}`
      const rawRes = await getRawBody(req, {
        limit: '8mb'
      })
      const photoUrl = await upload(fullFilename, rawRes)
      return res.status(200).send(photoUrl)
    } catch (e) {
      console.log('#Uploading to media server failed', e)
      return res.status(500).end()
    }
  }
  return res.status(400).json({ error: 'Request not supported' })
}

export default withAuth(handler)
