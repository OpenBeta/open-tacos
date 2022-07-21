import '@testing-library/jest-dom/extend-expect'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('../../../js/typesense/TypesenseClient')
jest.mock('../../../js/mapbox/Client')
jest.mock('../../../js/graphql/Client')

const mockTypesenseClient = jest.requireMock('../../../js/typesense/TypesenseClient')
const mockMapboxClient = jest.requireMock('../../../js/mapbox/Client')

const mockUseQuery = jest.fn()

jest.mock('@apollo/client', () => ({
  useQuery: mockUseQuery,
  gql: jest.fn()
}))

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

let XSearch
beforeAll(async () => {
  // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
  const module = await import('../XSearch')
  XSearch = module.default
})

test('XSearch triggers popup window', async () => {
  const user = userEvent.setup()
  const multiSearchFn = jest.spyOn(mockTypesenseClient, 'multiSearch')
  const geocoderLookupFn = jest.spyOn(mockMapboxClient, 'geocoderLookup')

  mockUseQuery.mockReturnValue({
    loading: false,
    cragNear: [{
      _id: 1,
      count: 5
    }]
  })

  render(<XSearch />)

  // `getByPlaceholderText()` is a bit fragile, but I haven't found a better
  // way to get the input element
  await user.type(screen.getByPlaceholderText('Climb search'), 'res{backspace}d')

  expect(multiSearchFn).toBeCalledTimes(5)
  expect(geocoderLookupFn).toBeCalledTimes(5)

  // Important - we need to wait for the popup result panel to appear
  await waitFor(() => {
    expect(screen.getAllByText(/red rock/i)).not.toBeNull()
  })

  // Todo:
  // - add more data to the mocked `TypesenseClient` module
  // - verify all sections are rendered
  // screen.debug() // uncomment to see the DOM
})
