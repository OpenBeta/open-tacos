import axios from 'axios'

const client = axios.create()

export const uploadPhoto = async (filename: string, rawData: Blob): Promise<string> => {
  const res = await client.post(
    '/api/media/upload?filename=' + encodeURIComponent(filename),
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
