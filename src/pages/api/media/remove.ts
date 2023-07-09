import { NextApiHandler } from 'next'
import withAuth from '../withAuth'

import { deleteMediaFromBucket } from '../../../js/media/storageClient'

// We need to disable the default body parser
export const config = {
  api: {
    bodyParser: false
  }
}

const handler: NextApiHandler<any> = async (req, res) => {
  if (req.method === 'POST') {
    try {
      if (req.query?.filename == null) {
        throw new Error('Missing filename query param')
      }

      const { filename } = req.query

      if (Array.isArray(filename)) {
        throw new Error('Expect only 1 filename param')
      }

      let filenameWithoutSlash = filename
      if (filename.startsWith('/')) {
        filenameWithoutSlash = filename.substring(1, filename.length)
      }
      await deleteMediaFromBucket(filenameWithoutSlash)
      return res.status(200).end()
    } catch (e) {
      console.log('Removing file from media server failed', e)
      return res.status(500).end()
    }
  }
  return res.status(400).json({ error: 'Request not supported' })
}

export default withAuth(handler)
