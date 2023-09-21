import { render, screen } from '@testing-library/react'

const mockedUseSession = jest.fn()

jest.mock('next-auth/react', () => ({
  useSession: mockedUseSession
}))

jest.requireMock('next-auth/react')

let EditProfileButton
beforeAll(async () => {
  // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
  const module = await import('../EditProfileButton')
  EditProfileButton = module.default
})

test('EditProfileButton renders when the user has logged in', async () => {
  mockedUseSession
    .mockClear()
    .mockReturnValue({ status: 'authenticated' })
  render(<EditProfileButton />)
  expect(mockedUseSession).toBeCalledTimes(1)
  expect(screen.queryByRole('button')).toBeDefined()
})

test('EditProfileButton renders null when the user hasn\'t logged in', async () => {
  mockedUseSession
    .mockClear()
    .mockReturnValue({ status: '' })
  render(<EditProfileButton />)
  expect(mockedUseSession).toBeCalledTimes(1)
  expect(screen.queryByRole('button')).toBeNull()
})
