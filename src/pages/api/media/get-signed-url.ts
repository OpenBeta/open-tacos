import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'
import { customAlphabet } from 'nanoid'
import { nolookalikesSafe } from 'nanoid-dictionary'
import { extname } from 'path'

import withAuth from '../withAuth'
import { s3Client, SIRV_CONFIG } from '../../../js/sirv/SirvClient'

export interface MediaPreSignedProps {
  url: string
  fullFilename: string
}
/**
 * Generate a pre-signed url for uploading photos to Sirv
 * @returns
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
      const session = await getSession({ req })
      if (session?.user?.metadata?.uuid == null) {
        throw new Error('Missing user metadata')
      }
      const { uuid } = session.user.metadata
      const fullFilename = `/u/${uuid}/${safeFilename(filename)}`

      const params = {
        Bucket: SIRV_CONFIG.s3Bucket, Key: fullFilename, Expires: 60
      }

      const url = s3Client.getSignedUrl('putObject', params)
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
