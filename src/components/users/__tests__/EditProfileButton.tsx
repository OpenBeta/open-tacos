import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import usePermissions from '../../../js/hooks/auth/usePermissions'

// Mock the usePermissions hook
jest.mock('../../../js/hooks/auth/usePermissions')

jest.requireMock('next-auth/react')

let EditProfileButton
beforeAll(async () => {
  // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
  const module = await import('../EditProfileButton')
  EditProfileButton = module.default
})

test('EditProfileButton renders when the user has logged in', async () => {
  (usePermissions as jest.Mock).mockReturnValue({ isAuthorized: true })
  render(<EditProfileButton loginsCount={5} />)
  screen.debug()
  expect(screen.queryByRole('button')).toBeDefined()
})

test('EditProfileButton renders null when the user hasn\'t logged in', async () => {
  (usePermissions as jest.Mock).mockReturnValue({ isAuthorized: false })

  render(<EditProfileButton loginsCount={0} />)
  expect(screen.queryByRole('button')).toBeNull()
})

test('EditProfileButton renders the tooltip when loginsCount is 1', async () => { // (the loginsCount is 1 after making the account and logging in)
  (usePermissions as jest.Mock).mockReturnValue({ isAuthorized: true })
  render(<EditProfileButton loginsCount={1} />)
  const tooltip = screen.queryByText(
    'It looks like this is your first time logging in, click here to change your username!'
  )
  expect(tooltip).toBeInTheDocument()
})

test('EditProfileButton does not render the tooltip when loginsCount is greater than 1', async () => {
  (usePermissions as jest.Mock).mockReturnValue({ isAuthorized: true })
  render(<EditProfileButton loginsCount={5} />)
  const tooltip = screen.queryByText(
    'It looks like this is your first time logging in, click here to change your username!'
  )
  expect(tooltip).not.toBeInTheDocument()
})
