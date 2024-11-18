import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MiniAlertProps } from '../MiniAlert'
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

let MiniAlertComponent: React.FC<MiniAlertProps>

describe('Banner suppression', () => {
  beforeAll(async () => {
    // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
    const module = await import('../MiniAlert')
    MiniAlertComponent = module.MiniAlert
  })

  it('doesn\'t show alert when cookie exists', async () => {
    // cookie exists
    cookieGetter.mockReturnValueOnce('foo')
    render(
      <MiniAlertComponent
        message={
          <div>
            important message
          </div>
      }
      />)

    expect(screen.queryAllByRole('button').length).toEqual(0)
  })

  it('shows alert', async () => {
    // Clear previous cookie setting if any
    cookieGetter.mockClear()

    const user = userEvent.setup({ skipHover: true })
    render(
      <MiniAlertComponent
        message={
          <div>
            important message 2
          </div>
      }
      />)

    // click the Suppress button
    await user.click(screen.getByRole('button', { name: /Don't show this again/i }))

    // alert dismissed
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })
})
