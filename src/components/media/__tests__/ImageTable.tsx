import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { groupBy } from 'underscore'

import type ImageTableType from '../ImageTable'
import { IUserProfile } from '../../../js/types'

jest.mock('../../../js/sirv/SirvClient')
jest.mock('../../../js/graphql/api')
jest.mock('../../../js/graphql/Client')

const sirvClient = jest.requireMock('../../../js/sirv/SirvClient')
const graphApi = jest.requireMock('../../../js/graphql/api')

const userProfile: IUserProfile = {
  authProviderId: '123',
  uuid: '12233455667',
  name: 'cat blue',
  nick: 'cool_nick_2022',
  avatar: 'something',
  bio: 'totem eatsum'
}

let ImageTable: typeof ImageTableType

describe('Image gallery', () => {
  let mediaList
  let tagsByMediaId

  beforeAll(async () => {
  // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
    const module = await import('../ImageTable')
    ImageTable = module.default

    /* Replicate getStaticProps() in /pages/[uid].tsx */
    const imageObj = await sirvClient.getUserImages('coolusername', 'verysecrettoken')
    mediaList = imageObj.mediaList
    const tagArray = await graphApi.getTagsByMediaId(['not important'])
    tagsByMediaId = groupBy(tagArray, 'mediaUuid')
  })

  test('Image can handle clicks and display slideshow', async () => {
    const user = userEvent.setup()

    const username = 'coolusername'
    render(
      <ImageTable
        auth={{ isAuthenticated: false, isAuthorized: false }}
        uid={username}
        userProfile={userProfile}
        initialImageList={mediaList}
        initialTagsByMediaId={tagsByMediaId}
      />)

    const images = screen.getAllByRole('figure')
    expect(images.length).toBe(mediaList.length)

    await user.click(images[0]) // click on the first image

    expect(screen.queryAllByRole('dialog', { name: username })).not.toBeNull()

    expect(screen.queryByRole('button', { name: 'previous' })).toBeNull() // Previous button shouldn't be there
    expect(screen.queryByRole('button', { name: 'next' })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: 'close' }))

    expect(screen.queryByRole('button', { name: 'next' })).toBeNull() // image viewer no longer visiable
  })

  test('Auuthorized users should see Tag toggle button.', async () => {
    render(
      <ImageTable
        auth={{ isAuthenticated: true, isAuthorized: true }}
        uid='coolusername1'
        userProfile={userProfile}
        initialImageList={mediaList}
        initialTagsByMediaId={tagsByMediaId}
      />)

    expect(screen.queryAllByRole('switch').length).toBeGreaterThan(0)
  })

  test('Signed, but not authorized users should *not* see Tag toggle button.', async () => {
    render(
      <ImageTable
        auth={{ isAuthenticated: true, isAuthorized: false }}
        uid='coolusername2'
        userProfile={userProfile}
        initialImageList={mediaList}
        initialTagsByMediaId={tagsByMediaId}
      />)

    expect(screen.queryAllByRole('switch')).toHaveLength(0)
  })

  test('Public users should *not* see Tag toggle button.', async () => {
    render(
      <ImageTable
        auth={{ isAuthenticated: true, isAuthorized: false }}
        uid='coolusername3'
        userProfile={userProfile}
        initialImageList={mediaList}
        initialTagsByMediaId={tagsByMediaId}
      />)

    expect(screen.queryAllByRole('switch')).toHaveLength(0)
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
