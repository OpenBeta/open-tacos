import { NextRequest } from 'next/server'
import { basename } from 'path/posix'
import { customAlphabet } from 'nanoid'
import { nolookalikesSafe } from 'nanoid-dictionary'
import { extname } from 'path'

import { PREDEFINED_HEADERS } from '@/js/auth/withUserAuth'
/**
 * For a given query string `?filename=u/{user_uuid}/{filename}` return `u/{user_uuid}/filename` by
 * resconstructing the path with uuid from the header to prevent spoofing attack.
 * @see withUserAuth
 */

export const getBucketPathFromRequest = (req: NextRequest): string | null => {
  const data = extractFilenameAndUuidFromAuthenticatedRequest(req)
  if (data == null) {
    return null
  }
  const filename = data[0]
  const uuid = data[1]
  /**
   * Important: no starting slash / when working with buckets
   */
  return `u/${uuid}/${basename(filename)}`
}

/**
 * Random filename generator
 */
const safeRandomFilename = (original: string): string => {
  return safeRandomString() + extname(original)
}

const safeRandomString = customAlphabet(nolookalikesSafe, 10)

/**
   * Extract filename and uuid of to-be-deleted media
   * @param req NextRequest
   * @returns [filename, uuid] or null if missing any of the params
   */
export const extractFilenameAndUuidFromAuthenticatedRequest = (req: NextRequest): [string, string] | null => {
  const searchParams = req.nextUrl.searchParams
  const filename = searchParams.get('filename')
  if (filename == null) {
    return null
  }

  /**
     * Extract uuid from http-header of authenticated request
     * because we can't trust the uuid in the query string
     */
  const uuid = req.headers.get(PREDEFINED_HEADERS.user_uuid)
  if (uuid == null) {
    return null
  }
  return [filename, uuid]
}

/* Construct an S3 path for a given media file and an authenticated user.  Format: `u/{user_uuid}/{filename}`.
   * It's super important **not** to have the leading slash '/'.
   */
export const prepareFilenameFromRequest = (req: NextRequest): string | null => {
  const data = extractFilenameAndUuidFromAuthenticatedRequest(req)
  if (data == null) {
    return null
  }
  const filename = data[0]
  const uuid = data[1]
  /**
     * Important: no starting slash / when working with buckets
     */
  return `u/${uuid}/${safeRandomFilename(filename)}`
}
