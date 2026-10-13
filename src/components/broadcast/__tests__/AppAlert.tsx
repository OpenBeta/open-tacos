import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppAlertProps } from '../AppAlert'
import React from 'react'

const cookieGetter = jest.fn()
const cookieSetter = jest.fn()

jest.mock('js-cookie', () => ({
  __esModule: 'true',
  default: {
    get: cookieGetter,
    set: cookieSetter
  }
}))

jest.mock('next-auth/react', () => ({
  __esModule: 'true',
  useSession: () => ({
    status: 'unauthenticated'
  })
}))

let AppAlertComponent: React.FC<AppAlertProps>

describe('AppAlert', () => {
  beforeAll(async () => {
    // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
    const module = await import('../AppAlert')
    AppAlertComponent = module.AppAlert
  })

  beforeEach(() => {
    cookieGetter.mockClear()
    cookieSetter.mockClear()
  })

  it('renders alert with message', () => {
    render(
      <AppAlertComponent
        cookieStorageKey='test'
        message={
          <div>
            important message
          </div>
        }
      />
    )

    expect(screen.getByText('important message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Don't show this again/i })).toBeInTheDocument()
  })

  it('sets cookie when suppress button is clicked', async () => {
    const user = userEvent.setup({ skipHover: true })

    render(
      <AppAlertComponent
        cookieStorageKey='test'
        message={
          <div>
            important message 2
          </div>
        }
      />
    )

    // click the Suppress button
    await user.click(screen.getByRole('button', { name: /Don't show this again/i }))

    // verify cookie was set
    expect(cookieSetter).toHaveBeenCalledWith('test', '1', { strict: true, expires: 30 })
  })

  it('renders alert immediately on initial mount for first-time visitors to prevent layout shift', () => {
    cookieGetter.mockReturnValue(undefined)

    render(
      <AppAlertComponent
        cookieStorageKey='test-initial-render'
        message={
          <div>
            welcome banner
          </div>
        }
      />
    )

    // Alert should be immediately in document without pop-in
    expect(screen.getByText('welcome banner')).toBeInTheDocument()
  })

  it('hides alert when suppression cookie is present', () => {
    cookieGetter.mockReturnValue('1')

    render(
      <AppAlertComponent
        cookieStorageKey='test-suppressed'
        message={
          <div>
            suppressed banner
          </div>
        }
      />
    )

    // Alert should not be visible when user has previously suppressed it
    expect(screen.queryByText('suppressed banner')).not.toBeInTheDocument()
  })
})
