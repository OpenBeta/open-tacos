import '@testing-library/jest-dom/extend-expect'
import { getToken, getUserImages } from '../SirvClient'

test('Sirv client', async () => {
  const token = await getToken()
  console.log('#token', token != null)
  const list = await getUserImages('abe96612-2742-43b0-a128-6b19d4e4615f', token)
  console.log('#getImages', list)
  expect(list.mediaList.length).toBeGreaterThan(0)
})
