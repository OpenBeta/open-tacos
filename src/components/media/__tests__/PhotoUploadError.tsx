import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('next/router')

jest.mock('../../DesktopAppBar')
jest.mock('../../MobileAppBar')
jest.mock('../../broadcast/AppAlert')

const getPhotoUploadErrorMessageFn = jest.fn()
const setPhotoUploadErrorMessageFn = jest.fn()

jest.mock('../../../js/stores/media', () => ({
  __esModule: 'true',
  userMediaStore: {
    use: {
      photoUploadErrorMessage: getPhotoUploadErrorMessageFn
    },
    set: {
      setPhotoUploadErrorMessage: setPhotoUploadErrorMessageFn
    }
  }
}))

let HeaderComponent

describe('Test photo upload error popup', () => {
  beforeAll(async () => {
    // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
    const module = await import('../../Header')
    HeaderComponent = module.default
  })

  it('shows photo upload error popup', async () => {
    // why skipHover=true? https://github.com/testing-library/user-event/issues/922
    const user = userEvent.setup({ skipHover: true })

    getPhotoUploadErrorMessageFn.mockReturnValue(null)

    render(<HeaderComponent />)

    // no popup
    expect(screen.queryByText('Woof!')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()

    getPhotoUploadErrorMessageFn.mockReturnValue('Woof!')

    render(<HeaderComponent />)

    expect(screen.queryByText('Woof!')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Ok/i }))

    expect(setPhotoUploadErrorMessageFn).toHaveBeenCalledWith(null)
  })
})
