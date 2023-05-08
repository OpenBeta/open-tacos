import { v4 } from 'uuid'
import { MediaWithTags } from '../../../js/types'

export const mediaList: MediaWithTags[] = [
  {
    id: v4(),
    mediaUrl: '/img1.jpg',
    width: 1200,
    height: 960,
    format: 'jpeg',
    size: 30000,
    uploadTime: new Date(),
    entityTags: []
  },
  {
    id: v4(),
    width: 1200,
    height: 960,
    format: 'jpeg',
    size: 30000,
    uploadTime: new Date(),
    entityTags: [],
    mediaUrl: '/img2.jpg'
  },
  {
    id: v4(),
    width: 1200,
    height: 960,
    format: 'jpeg',
    size: 30000,
    uploadTime: new Date(),
    entityTags: [],
    mediaUrl: '/img3.jpg'
  },
  {
    id: v4(),
    width: 1200,
    height: 960,
    format: 'jpeg',
    size: 30000,
    uploadTime: new Date(),
    entityTags: [],
    mediaUrl: '/img4.jpg'
  },
  {
    id: v4(),
    width: 1200,
    height: 960,
    format: 'jpeg',
    size: 30000,
    uploadTime: new Date(),
    entityTags: [],
    mediaUrl: '/img5.jpg'
  },
  {
    id: v4(),
    width: 1200,
    height: 960,
    format: 'jpeg',
    size: 30000,
    uploadTime: new Date(),
    entityTags: [],
    mediaUrl: '/img6.jpg'
  }
]

it.skip('Test data', () => {})
