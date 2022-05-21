import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('../../../js/sirv/SirvClient')
jest.mock('../../../js/graphql/api')
jest.mock('../../../js/graphql/Client')

const sirvClient = jest.requireMock('../../../js/sirv/SirvClient')

let ImageTagger

beforeAll(async () => {
  // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
  const module = await import('../../media/ImageTagger')
  ImageTagger = module.default
})

test('ImageTagger can render', async () => {
  const { mediaList } = await sirvClient.getUserImages('coolusername', 'verysecrettoken')

  const user = userEvent.setup()
  const mockCloseFn = jest.fn()
  const mockOnCompleted = jest.fn()

  const { unmount } = render(
    <ImageTagger
      isOpen={false}
      mouseXY={[200, 150]}
      imageInfo={mediaList[0]}
      close={mockCloseFn}
      onCompleted={mockOnCompleted}
    />)

  expect(screen.queryByRole('searchbox')).toBeNull()

  unmount()

  render(
    <ImageTagger
      isOpen
      mouseXY={[200, 150]}
      imageInfo={mediaList[0]}
      close={mockCloseFn}
      onCompleted={mockOnCompleted}
    />)

  expect(screen.queryByRole('searchbox')).not.toBeNull()

  await user.keyboard('{escape}')

  expect(mockCloseFn).toBeCalledTimes(1)
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})
