import '@testing-library/jest-dom/extend-expect'
import { getToken, getUserImages } from '../SirvClient'

test('Sirv client', async () => {
  const token = await getToken()
  const list = await getUserImages('1232', token)
})
