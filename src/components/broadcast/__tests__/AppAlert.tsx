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

describe('Banner suppression', () => {
  beforeAll(async () => {
    // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
    const module = await import('../AppAlert')
    AppAlertComponent = module.AppAlert
  })

  it('doesn\'t show alert when cookie exists', async () => {
    // cookie exists
    cookieGetter.mockReturnValueOnce('foo')
    render(
      <AppAlertComponent
        message={
          <div>
            important message
          </div>
      }
      />)

    expect(screen.queryAllByRole('button').length).toEqual(0)
    cookieGetter.mockClear()
  })

  it('shows alert', async () => {
    // Clear previous cookie setting if any
    // cookieGetter.mockClear()
    // cookieGetter.mockRejectedValueOnce(null)
    const user = userEvent.setup({ skipHover: true })
    render(
      <AppAlertComponent
        message={
          <div>
            important message 2
          </div>
      }
      />)
    screen.debug()
    // click the Suppress button
    await user.click(screen.getByRole('button', { name: /Don't show this again/i }))

    // alert dismissed
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })
})
