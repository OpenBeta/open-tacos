import '@testing-library/jest-dom/extend-expect'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('../../../js/graphql/Client')
jest.mock('../../../js/typesense/TypesenseClient')
jest.mock('../../../js/mapbox/MapboxClient')

const MockedTypesenseClient = jest.requireMock('../../../js/typesense/TypesenseClient')

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
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

let ClimbSearchForTagging
beforeAll(async () => {
  // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
  const module = await import('../ClimbSearchForTagging')
  ClimbSearchForTagging = module.default
})

test('Climb search for tagging', async () => {
  const user = userEvent.setup()
  const climbSearchByNameFn = jest.spyOn(MockedTypesenseClient, 'climbSearchByName')
  const onSelectFn = jest.fn()
  render(<ClimbSearchForTagging onSelect={onSelectFn} />)

  // await user.click(screen.getByRole('button', { name: 'climb-search' }))

  // `getByPlaceholderText()` is a bit fragile, but I haven't found a better
  // way to get the Algolia input element
  await user.type(screen.getByPlaceholderText('Climb search'), 'qw{backspace}{backspace}r')

  // Make sure non-empty input triggers an API call
  expect(climbSearchByNameFn).toBeCalledTimes(4)

  // Important - we need to wait for the popup result panel to appear
  await waitFor(() => {
    expect(screen.getAllByText(/red rock/i)).not.toBeNull()
  })

  // Todo:
  // - add more data to the mocked `TypesenseClient` module
  // - verify all sections are rendered
  // screen.debug() // uncomment to see the DOM
})
