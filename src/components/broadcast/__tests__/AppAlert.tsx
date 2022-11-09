import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('next/router')

jest.mock('../../DesktopAppBar')
jest.mock('../../MobileAppBar')
jest.mock('../../media/PhotoUploadError')

jest.mock('../../../js/stores/media')

let HeaderComponent

describe('Test photo upload error popup', () => {
  beforeAll(async () => {
    // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
    const module = await import('../../Header')
    HeaderComponent = module.default
  })

  it('shows app alert', async () => {
    const user = userEvent.setup({ skipHover: true })

    render(<HeaderComponent />)

    // there should be at least 2 buttons, temporarily dismiss & never show again
    expect(screen.queryAllByRole('button').length).toBeGreaterThanOrEqual(2)

    await user.click(screen.getByRole('button', { name: /Don't show this again/i }))

    // alert dismissed
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })
})
