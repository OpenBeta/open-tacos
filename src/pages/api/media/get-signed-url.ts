import { NextApiHandler } from 'next'
import { customAlphabet } from 'nanoid'
import { nolookalikesSafe } from 'nanoid-dictionary'
import { extname } from 'path'
import { getServerSession } from 'next-auth'
import { GetSignedUrlConfig, Storage } from '@google-cloud/storage'
import withAuth from '../withAuth'
import { authOptions } from '../auth/[...nextauth]'

/**
 * GCloud storage client.  Todo: move this to its own module.
 */
const storage = new Storage({
  credentials: {
    type: 'service_account',
    private_key: process.env.GC_BUCKET_PRIVATE_KEY ?? '',
    client_email: process.env.GC_BUCKET_CLIENT_EMAIL ?? ''
  }
})

export interface MediaPreSignedProps {
  url: string
  fullFilename: string
}

/**
 * Generate a pre-signed url for uploading photos to Google storage.
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
      const fullFilename = `u/${uuid}/${safeFilename(filename)}`

      const options: GetSignedUrlConfig = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000 // 15 minutes
      }

      // Get a signed URL for uploading the file
      const [url] = await storage
        .bucket(process.env.GC_BUCKET_NAME ?? '')
        .file(fullFilename)
        .getSignedUrl(options)

      console.log('##', url)
      if (url != null) {
        return res.status(200).json({ url, fullFilename })
      } else {
        throw new Error('Error generating upload url')
      }
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
