import ImageKit from 'imagekit'
import { ListFileResponse } from 'imagekit/libs/interfaces'

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUB_KEY,
  privateKey: process.env.NEXT_IMAGEKIT_PRIVATE_KEY, // Server side key only!
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL
})

export const listFile = async (): Promise<ListFileResponse[]> => {
  const res = await imagekit.listFiles({})
  return res
}
