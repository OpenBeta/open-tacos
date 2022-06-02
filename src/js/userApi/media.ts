import axios from 'axios'

const client = axios.create()

export const uploadPhoto = async (uuid: string, filename: string, rawData: Blob): Promise<string> => {
  const baseFilename = encodeURIComponent(`/u/${uuid}/${filename}`)

  const res = await client.post(
    '/api/media/upload?filename=' + baseFilename,
    rawData,
    {
      headers: {
        'Content-Type': 'image/jpeg'
      }
    }
  )

  if (res.status === 200) {
    return res.data
  }
  throw new Error('Photo upload from browser failed')
}
