import '@testing-library/jest-dom/extend-expect'
import { getToken, getUserImages, SIRV_CONFIG, remove, getAdminToken } from '../../../js/sirv/SirvClient'
import { enhanceMediaListWithUsernames } from '../../../js/usernameUtil'

/**
 * End-to-end tests require Sirv RW secrets.
 * 1. Make a copy of .env.local for testing
 * `cp .env.local .env.test.local`
 * 2. Run e2e tests
 * `yarn test-all e2e`
 */

beforeAll(() => {
  expect(SIRV_CONFIG.clientSecret).not.toBeNull()
  expect(SIRV_CONFIG.baseUrl).not.toBeNull()
  expect(SIRV_CONFIG.clientId).not.toBeNull()
  expect(SIRV_CONFIG.clientAdminId).not.toBeNull()
  expect(SIRV_CONFIG.clientAdminSecret).not.toBeNull()
})

test('Sirv API can read photos', async () => {
  const token = await getToken()
  const list = await getUserImages('abe96612-2742-43b0-a128-6b19d4e4615f', 2, token)
  expect(list.mediaList.length).toBeGreaterThan(0)
})

test('can read uid json', async () => {
  const paths = [
    {
      mediaUrl: '/u/abe96612-2742-43b0-a128-6b19d4e4615f/1.jpg',
      mediaUuid: '1',
      mediaType: 0,
      destType: 0,
      destination: '1',
      uid: 'mary'
    },
    {
      mediaUrl: '/u/abe96612-2742-43b0-a128-6b19d4e4615f/2.jpg',
      mediaUuid: '2',
      mediaType: 0,
      destType: 0,
      destination: '1',
      uid: 'mary'
    }
  ]
  const list = await enhanceMediaListWithUsernames(paths)
  expect(list.length).toEqual(2)
  expect(list[0].uid).toMatch(/vietnguyen/)

  // await getUserFiles('abe96612-2742-43b0-a128-6b19d4e4615f')
})

test('can delete photos', async () => {
  const token = await getAdminToken()
  expect(token).toBeDefined()
  if (token != null) {
    await expect(remove('/foo.txt', token)).rejects.toThrow('Request failed with status code 404')
  }
})
