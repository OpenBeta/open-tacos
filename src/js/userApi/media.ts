import axios from 'axios'

import { MediaPreSignedProps } from '@/app/api/user/get-signed-url/route'

const client = axios.create()

/**
 * Upload a photo to the user home dir on our image hosting provider.  User metadata comes from Auth session object.
 * @param filename
 * @param rawData photo data
 * @returns full url of the uploaded photo
 */
export const uploadPhoto = async (filename: string, rawData: ArrayBuffer): Promise<string> => {
  const res = await client.get<MediaPreSignedProps>(
    '/api/user/get-signed-url?filename=' + encodeURIComponent(filename))

  if (res.data?.url != null && res.data?.fullFilename != null) {
    const signedUploadUrl = res.data.url
    const headers = {
      'Content-Type': 'image/jpeg'
    }
    const res2 = await client.put(signedUploadUrl, rawData, { headers })
    if (res2.status === 200) {
      return res.data.fullFilename
    }
    throw new Error('Image provider error: ' + res2.statusText)
  }
  throw new Error('Missing upload data')
}

export const deleteMediaFromStorage = async (filename: string): Promise<void> => {
  const res = await client.post(
    '/api/user/remove-media?filename=' + encodeURIComponent(filename),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  if (res.status === 200) {
    return
  }
  throw new Error('Local delete media api failed')
}
