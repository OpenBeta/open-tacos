import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type UserGalleryType from '../UserGallery'
import { userMedia } from './data'
import { UserPublicPage } from '../../../js/types/User'
import { UseMediaCmdReturn } from '../../../js/hooks/useMediaCmd'

jest.mock('next/router')

jest.mock('../../../js/hooks/useResponsive')
jest.mock('../../../js/hooks/auth/usePermissions')
jest.mock('../../../js/graphql/api')
jest.mock('../../../js/graphql/Client')

jest.mock('../UploadCTA', () => ({
  __esModule: true,
  default: jest.fn()
}))

const fetchMoreMediaForward = jest.fn()

fetchMoreMediaForward.mockResolvedValueOnce(userMedia.mediaConnection)

jest.mock('../../../js/hooks/useMediaCmd', () => ({
  __esModule: true,
  default: (): Partial<UseMediaCmdReturn> => ({ fetchMoreMediaForward })
}))

const useResponsive = jest.requireMock('../../../js/hooks/useResponsive')
const usePermissions = jest.requireMock('../../../js/hooks/auth/usePermissions')

// eslint-disable-next-line
const { pushFn, replaceFn } = jest.requireMock('next/router')

const useResponsiveMock = jest.spyOn(useResponsive, 'default')
useResponsiveMock.mockReturnValue({ isDesktop: false, isMobile: true, isTablet: true })

const usePermissionsHook = jest.spyOn(usePermissions, 'default')

const userProfile: UserPublicPage = {
  profile: {
    userUuid: 'de7a092e-5c3c-445d-a863-b5fbe145e016',
    displayName: 'cat blue',
    username: 'cool_nick_2022',
    avatar: 'https://example.com/avatar.jpg',
    bio: 'totem eatsum'
  },
  media: userMedia
}

let UserGallery: typeof UserGalleryType

describe('Image gallery', () => {
  beforeAll(async () => {
    // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
    const module = await import('../UserGallery')
    UserGallery = module.default
  })

  test('[Desktop] Image can handle clicks and display slideshow', async () => {
    const user = userEvent.setup()

    const username = 'coolusername'

    useResponsiveMock.mockReturnValue({ isDesktop: true, isMobile: false, isTablet: false })
    usePermissionsHook.mockReturnValue({ isAuthorized: true, isAuthenticated: true })
    render(
      <UserGallery
        uid={username}
        postId={null}
        userPublicPage={userProfile}
      />)

    const images = await screen.findAllByRole('img')
    expect(images.length).toBe(userMedia.mediaConnection.edges.length)

    await user.click(images[0]) // click on the first image

    expect(pushFn).toBeCalled()

    expect(screen.queryAllByRole('dialog', { name: username })).not.toBeNull()

    // expect(screen.queryByRole('button', { name: 'previous' })).toBeNull() // Previous button shouldn't be there
    // expect(screen.queryByRole('button', { name: 'next' })).toBeEnabled()

    // await user.click(screen.getByRole('button', { name: 'next' }))

    // expect(replaceFn).toBeCalled() // router should update browser url

    // await user.click(screen.getByRole('button', { name: 'close' }))

    // expect(screen.queryByRole('button', { name: 'next' })).toBeNull() // image viewer no longer visiable
  })
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

beforeEach(() => {
  // IntersectionObserver isn't available in test environment
  const mockIntersectionObserver = jest.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  })
  window.IntersectionObserver = mockIntersectionObserver
})
