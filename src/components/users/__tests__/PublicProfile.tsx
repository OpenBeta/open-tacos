import ''
import { render, screen } from '@testing-library/react'
import { v4 as uuidv4 } from 'uuid'

import type PublicProfileType from '../PublicProfile'
import { UserPublicProfile } from '../../../js/types/User'

const mockedUseSession = jest.fn()

jest.mock('next-auth/react', () => ({
  useSession: mockedUseSession
}))

// Mock import ticks button beacause we only care whether the button is there
// and to avoid mocking GQL dependency.
const ImportFromMtnProjMock = jest.fn()
jest.mock('../ImportFromMtnProj', () => {
  return {
    __esModule: true,
    default: ImportFromMtnProjMock
  }
})

jest.requireMock('next-auth/react')

const userProfile: Required<UserPublicProfile> = {
  userUuid: uuidv4().toString(),
  displayName: 'cat blue',
  username: 'cool_nick_2022',
  avatar: 'https://example.com/myavatar.jpg',
  bio: 'totem eatsum',
  website: 'https://example.com'
}

const mockAuth0UserMetadata = {
  user: {
    metadata: {
      uuid: userProfile.userUuid
    }
  }
}

let PublicProfile: typeof PublicProfileType
beforeAll(async () => {
  // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
  const module = await import('../PublicProfile')
  PublicProfile = module.default
})

test('Profile detail when the user is logged in.', async () => {
  mockedUseSession
    .mockClear()
    .mockReturnValue({
      status: 'authenticated',
      data: mockAuth0UserMetadata
    })

  render(<PublicProfile userProfile={userProfile} />)

  expect(mockedUseSession).toBeCalled()

  expect(screen.getByRole('link', { name: /edit/i })).toHaveAttribute('href', '/account/editProfile')

  expect(screen.queryByText(userProfile.displayName)).not.toBeNull()
  expect(screen.queryByText(userProfile.username)).not.toBeNull()
  expect(screen.queryByText(userProfile.bio)).not.toBeNull()
  expect(screen.getByRole('link', { name: /example\.com/ })).toHaveAttribute('href', userProfile.website)
})

test('Username edit link is not present when the user is logged out.', async () => {
  mockedUseSession
    .mockClear()
    .mockReturnValue({ status: '' })

  render(<PublicProfile userProfile={userProfile} />)

  expect(mockedUseSession).toBeCalled()
  expect(screen.queryByRole('link', { name: /edit/i })).toBeNull()
  expect(screen.queryByText(userProfile.username)).not.toBeNull()
})
