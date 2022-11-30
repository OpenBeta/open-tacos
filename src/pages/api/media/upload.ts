import getRawBody from 'raw-body'
import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'
import { customAlphabet } from 'nanoid'
import { nolookalikesSafe } from 'nanoid-dictionary'
import { extname } from 'path'
import sharp from 'sharp'

import withAuth from '../withAuth'
import { upload } from '../../../js/sirv/SirvClient'

const MAX_THRESHOLD_SIZE_KB = 2097152 // size at which we apply size reduction
const MAX_HARD_LIMIT_SIZE = '10mb' // size at which we will flat out reject the image

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
      if (Array.isArray(filename)) {
        throw new Error('Expect only 1 filename param')
      }

      const { uuid } = session.user.metadata
      const fullFilename = `/u/${uuid}/${safeFilename(filename)}`
      const rawRes = await getRawBody(req, {
        limit: MAX_HARD_LIMIT_SIZE
      })

      const newImage = await reduceImage(rawRes)

      const photoUrl = await upload(fullFilename, newImage)
      return res.status(200).send(photoUrl)
    } catch (e) {
      console.log('#Uploading to media server failed', e)
      return res.status(500).end()
    }
  }
  return res.status(400).json({ error: 'Request not supported' })
}

/**
 * Random filename generator
 */
const safeFilename = (original: string): string => {
  return safeRandomString() + extname(original)
}

const safeRandomString = customAlphabet(nolookalikesSafe, 10)

/**
 * Reduce image size if it exceeds the
 * @param original
 * @returns new image
 */
export const reduceImage = async (original: Buffer): Promise<Buffer> => {
  const newImage = await sharp(original)
    .metadata()
    .then(({ width, height, size }) => {
      if (size < MAX_THRESHOLD_SIZE_KB) return original

      const options: any = { withoutEnlargement: true }
      if (width >= height) {
        options.width = 2560
      } else {
        options.height = 2560
      }

      return sharp(original)
        .resize(options)
        .jpeg()
        .toBuffer()
    })

  return newImage
}

export default withAuth(handler)
