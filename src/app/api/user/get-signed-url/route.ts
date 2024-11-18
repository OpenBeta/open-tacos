import { NextRequest, NextResponse } from 'next/server'
import { customAlphabet } from 'nanoid'
import { nolookalikesSafe } from 'nanoid-dictionary'
import { extname } from 'path'

import { withUserAuth, PREDEFINED_HEADERS } from '@/js/auth/withUserAuth'
import { getSignedUrlForUpload } from '@/js/media/storageClient'

export interface MediaPreSignedProps {
  url: string
  fullFilename: string
}

/**
 * Endpoint for getting a signed url to upload a media file to remote cloud storage.
 * Usage: `/api/user/get-signed-url?filename=image001.jpg`
 * See https://cloud.google.com/storage/docs/access-control/signed-urls
 */
const getHanlder = async (req: NextRequest): Promise<any> => {
  try {
    const fullFilename = prepareFilenameFromRequest(req)
    if (fullFilename == null) {
      return NextResponse.json({ status: 400 })
    }
    const url = await getSignedUrlForUpload(fullFilename)

    return NextResponse.json({ url, fullFilename: '/' + fullFilename })
  } catch (e) {
    console.error('Uploading to media server failed', e)
    return NextResponse.json({ status: 500 })
  }
}

export const GET = withUserAuth(getHanlder)

/**
 * Random filename generator
 */
const safeFilename = (original: string): string => {
  return safeRandomString() + extname(original)
}

const safeRandomString = customAlphabet(nolookalikesSafe, 10)

/**
 * Construct the S3 path for a given media file and an authenticated user.  Format: `u/{user_uuid}/{filename}`.
 * It's super important **not** to have the leading slash '/'.
 */
export const prepareFilenameFromRequest = (req: NextRequest): string | null => {
  const searchParams = req.nextUrl.searchParams
  const filename = searchParams.get('filename')
  if (filename == null) {
    return null
  }

  const uuid = req.headers.get(PREDEFINED_HEADERS.user_uuid)
  if (uuid == null) {
    return null
  }

  /**
   * Important: no starting slash / when working with buckets
   */
  return `u/${uuid}/${safeFilename(filename)}`
}
