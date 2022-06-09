import '@testing-library/jest-dom/extend-expect'
import { getToken, getUserImages, SIRV_CONFIG } from '../../../js/sirv/SirvClient'
import { enhanceMediaListWithUsernames } from '../../../js/usernameUtil'

beforeAll(() => {
  expect(SIRV_CONFIG.clientSecret).not.toBeNull()
  expect(SIRV_CONFIG.baseUrl).not.toBeNull()
  expect(SIRV_CONFIG.clientId).not.toBeNull()
})

test('Sirv API can read photos', async () => {
  const token = await getToken()
  const list = await getUserImages('abe96612-2742-43b0-a128-6b19d4e4615f', token)
  expect(list.mediaList.length).toBeGreaterThan(0)
})

test('can read uid json', async () => {
  const paths = [
    {
      mediaUrl: '/u/abe96612-2742-43b0-a128-6b19d4e4615f/1.jpg',
      mediaUuid: '1',
      mediaType: 0,
      destType: 0
    },
    {
      mediaUrl: '/u/abe96612-2742-43b0-a128-6b19d4e4615f/2.jpg',
      mediaUuid: '2',
      mediaType: 0,
      destType: 0
    }
  ]
  const list = await enhanceMediaListWithUsernames(paths)
  expect(list.length).toEqual(1)
  expect(list[0].uid).toMatch(/vietnguyen/)
})
