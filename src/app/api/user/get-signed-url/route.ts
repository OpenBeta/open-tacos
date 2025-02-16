import { NextRequest, NextResponse } from 'next/server'
import { getSignedUrlForUpload } from '@/js/media/storageClient'
import { prepareFilenameFromRequest } from './utils'
import { withUserAuth } from '@/js/auth/withUserAuth'

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
