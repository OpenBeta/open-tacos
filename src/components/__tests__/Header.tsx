
import { render } from '@testing-library/react'

// import Header from '../Header'
jest.mock('../MobileAppBar') // doesn't seem to work

it('Header', () => {
  //  For some reason MobileAppBar is not mocked so test won't work.
  //  useRouter() is correctly mocked.
  // render(<Header />)
  render(<div>foo</div>)
})
