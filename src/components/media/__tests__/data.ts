import { v4 } from 'uuid'
import { MediaFormat, MediaWithTags, UserMedia } from '../../../js/types'

export const mediaList: MediaWithTags[] = [
  {
    id: v4(),
    mediaUrl: '/img1.jpg',
    width: 1200,
    height: 960,
    format: MediaFormat.jpg,
    size: 30000,
    uploadTime: new Date(),
    entityTags: []
  },
  {
    id: v4(),
    width: 1200,
    height: 960,
    format: MediaFormat.jpg,
    size: 30000,
    uploadTime: new Date(),
    entityTags: [],
    mediaUrl: '/img2.jpg'
  },
  {
    id: v4(),
    width: 1200,
    height: 960,
    format: MediaFormat.jpg,
    size: 30000,
    uploadTime: new Date(),
    entityTags: [],
    mediaUrl: '/img3.jpg'
  },
  {
    id: v4(),
    width: 1200,
    height: 960,
    format: MediaFormat.jpg,
    size: 30000,
    uploadTime: new Date(),
    entityTags: [],
    mediaUrl: '/img4.jpg'
  },
  {
    id: v4(),
    width: 1200,
    height: 960,
    format: MediaFormat.jpg,
    size: 30000,
    uploadTime: new Date(),
    entityTags: [],
    mediaUrl: '/img5.jpg'
  },
  {
    id: v4(),
    width: 1200,
    height: 960,
    format: MediaFormat.jpg,
    size: 30000,
    uploadTime: new Date(),
    entityTags: [],
    mediaUrl: '/img6.jpg'
  }
]

export const userMedia: UserMedia = {
  userUuid: '539eec72-c209-4de9-ad50-66c548fc2ace',
  mediaConnection: {
    edges: mediaList.map((entry, index) => ({
      node: entry,
      cursor: `${entry.uploadTime.getDate()}_${index}}`
    })),
    pageInfo: {
      hasNextPage: true,
      endCursor: '1234'
    }
  }

}

it.skip('Test data', () => {})
