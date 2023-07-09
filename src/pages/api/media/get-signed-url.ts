import { NextApiHandler } from 'next'
import { customAlphabet } from 'nanoid'
import { nolookalikesSafe } from 'nanoid-dictionary'
import { extname } from 'path'
import { getServerSession } from 'next-auth'
import withAuth from '../withAuth'
import { authOptions } from '../auth/[...nextauth]'
import { getSignedUrlForUpload } from '../../../js/media/storageClient'

export interface MediaPreSignedProps {
  url: string
  fullFilename: string
}

/**
 * Local API getting a signed url for uploading media to Google storage.
 *
 * Usage: `/api/media/get-signed-url?filename=image001.jpg`
 *
 * See https://cloud.google.com/storage/docs/access-control/signed-urls
 */
const handler: NextApiHandler<MediaPreSignedProps> = async (req, res) => {
  if (req.method === 'GET') {
    try {
      if (req.query?.filename == null) {
        throw new Error('Missing filename query param')
      }
      const { filename } = req.query
      if (Array.isArray(filename)) {
        throw new Error('Expect only 1 filename param')
      }
      const session = await getServerSession(req, res, authOptions)
      if (session?.user?.metadata?.uuid == null) {
        throw new Error('Missing user metadata')
      }
      const { uuid } = session.user.metadata
      /**
       * Important: no starting / when working with buckets
       */
      const fullFilename = `u/${uuid}/${safeFilename(filename)}`

      const url = await getSignedUrlForUpload(fullFilename)

      return res.status(200).json({ url, fullFilename: '/' + fullFilename })
    } catch (e) {
      console.log('Uploading to media server failed', e)
      return res.status(500).end()
    }
  }
  return res.status(400).end()
}

export default withAuth(handler)

/**
 * Random filename generator
 */
const safeFilename = (original: string): string => {
  return safeRandomString() + extname(original)
}

const safeRandomString = customAlphabet(nolookalikesSafe, 10)
