import axios from 'axios'

const client = axios.create()

export const uploadPhoto = async (filename: string, rawData: ArrayBuffer): Promise<string> => {
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

export const removePhoto = async (filename: string): Promise<string> => {
  const res = await client.post(
    '/api/media/remove?filename=' + encodeURIComponent(filename),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  if (res.status === 200) {
    return res.data
  }
  throw new Error('Delete failed')
}
