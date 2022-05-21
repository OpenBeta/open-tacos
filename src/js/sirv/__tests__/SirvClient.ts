import '@testing-library/jest-dom/extend-expect'
import { getToken, getUserImages, SIRV_CONFIG } from '../SirvClient'

beforeAll(() => {
  expect(SIRV_CONFIG.clientSecret).not.toBeNull()
  expect(SIRV_CONFIG.baseUrl).not.toBeNull()
  expect(SIRV_CONFIG.clientId).not.toBeNull()
})

test('Sirv client', async () => {
  const token = await getToken()
  const list = await getUserImages('abe96612-2742-43b0-a128-6b19d4e4615f', token)
  expect(list.mediaList.length).toBeGreaterThan(0)
})
