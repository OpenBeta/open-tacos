import { UserImageReturnType } from '../SirvClient'
const Client = jest.requireActual('../SirvClient')

export const SIRV_CONFIG = Client.SIRV_CONFIG

export const getUserImages = async (uuid: string, token?: string): Promise<UserImageReturnType> => ({
  mediaList: [
    {
      ownerId: 'abe96612-2742-43b0-a128-6b19d4e4615f',
      filename: '/u/abe96612-2742-43b0-a128-6b19d4e4615f/prussik-peak.jpeg',
      mediaId: '5a6798c9-12b9-5c2c-aea2-793a1a3a22c0',
      ctime: new Date('2022-05-16T16:27:51.008Z'),
      mtime: new Date('2022-05-16T16:29:03.196Z'),
      contentType: 'image/jpeg',
      meta: { width: 1500, height: 1000, format: 'JPEG', duration: 0 }
    },
    {
      ownerId: 'abe96612-2742-43b0-a128-6b19d4e4615f',
      filename: '/u/abe96612-2742-43b0-a128-6b19d4e4615f/annunaki.jpeg',
      mediaId: 'acc88e88-6ad2-586f-8630-a6f69b6b79cd',
      ctime: new Date('2022-05-16T16:27:50.860Z'),
      mtime: new Date('2022-05-16T16:29:03.196Z'),
      contentType: 'image/jpeg',
      meta: { width: 1200, height: 800, format: 'JPEG', duration: 0 }
    }
  ],
  mediaIdList: [
    '5a6798c9-12b9-5c2c-aea2-793a1a3a22c0', 'acc88e88-6ad2-586f-8630-a6f69b6b79cd']
})
