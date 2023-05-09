import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type UserGalleryType from '../UserGallery'
import { IUserProfile } from '../../../js/types'
import { mediaList } from './data'

jest.mock('next/router')

jest.mock('../../../js/hooks/useResponsive')
jest.mock('../../../js/sirv/SirvClient')
jest.mock('../../../js/graphql/api')
jest.mock('../../../js/graphql/Client')

jest.mock('../UploadCTA', () => ({
  __esModule: true,
  default: jest.fn()
}))

const useResponsive = jest.requireMock('../../../js/hooks/useResponsive')

// eslint-disable-next-line
const { pushFn, replaceFn } = jest.requireMock('next/router')

const useResponsiveMock = jest.spyOn(useResponsive, 'default')
useResponsiveMock.mockReturnValue({ isDesktop: false, isMobile: true, isTablet: true })

const userProfile: IUserProfile = {
  authProviderId: '123',
  uuid: '12233455667',
  name: 'cat blue',
  nick: 'cool_nick_2022',
  avatar: 'something',
  bio: 'totem eatsum',
  roles: [],
  loginsCount: 2
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

    render(
      <UserGallery
        auth={{ isAuthenticated: false, isAuthorized: false }}
        uid={username}
        postId={null}
        userProfile={userProfile}
        initialImageList={mediaList}
      />)

    const images = screen.getAllByRole('img')
    expect(images.length).toBe(mediaList.length)

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
