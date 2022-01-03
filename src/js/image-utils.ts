import axios from 'axios'

const client = axios.create({
  baseURL: 'https://api.cloudinary.com/v1_1/openbeta-prod'
})

export const uploadImage = async (imageData: string | Blob): Promise<string> => {
  const payload = new FormData()
  payload.append('file', imageData)
  payload.append('upload_preset', 'mochigome')

  // TODO: add area/climb id to photo metadata
  //   const context = object2context(options.context);
  //   options && options.context && payload.append("context", context);

  const res = await client.post('/image/upload', payload)
  if (res.status === 200) return res.data.secure_url
  return await Promise.reject(new Error('Error uploading image'))
}

/**
 *  convert object to key=value separated by |
 * @param context cloudinary context object (key:value)
 */
// eslint-disable-next-line no-unused-vars
const object2context = (context?: Record<string, string>): string => {
  return context !== undefined
    ? Object.keys(context)
      .map((key) => `${key}=${context[key]}`)
      .join('|')
    : ''
}
