import { MediaBaseTag } from '../../types'

export const getCragDetailsNear = jest.fn().mockImplementation(() => {
  console.log('## mock graphql')
  return {
    data: [],
    error: 'API error',
    placeId: undefined
  }
})

export const getTagsByMediaId = async (uuidList: string[]): Promise<Array<Partial<MediaBaseTag>>> => ([
  {
    mediaUuid: '5a6798c9-12b9-5c2c-aea2-793a1a3a22c0',
    mediaUrl: '/u/abe96612-2742-43b0-a128-6b19d4e4615f/prussik-peak.jpeg',
    climb: {
      id: '82ac3ff7-2f2b-56e4-9105-c8d8821e1b42',
      name: 'Low Cholesterol'
    }
  },
  {
    mediaUuid: '5a6798c9-12b9-5c2c-aea2-793a1a3a22c0',
    mediaUrl: '/u/abe96612-2742-43b0-a128-6b19d4e4615f/prussik-peak.jpeg',
    climb: {
      id: '66f60c71-0323-5e72-bb84-dcc8af0bb9fa',
      name: 'Jolly Rancher'
    }
  }
]
)
