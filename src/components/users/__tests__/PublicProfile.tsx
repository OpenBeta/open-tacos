import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { v4 as uuidv4 } from 'uuid'

import { IUserProfile } from '../../../js/types'
import type PublicProfileType from '../PublicProfile'

const mockedUseSession = jest.fn()

jest.mock('next-auth/react', () => ({
  useSession: mockedUseSession
}))

jest.requireMock('next-auth/react')

const userProfile: IUserProfile = {
  authProviderId: '123',
  uuid: uuidv4(),
  name: 'cat blue',
  nick: 'cool_nick_2022',
  avatar: 'something',
  bio: 'totem eatsum'
}

let PublicProfile: typeof PublicProfileType
beforeAll(async () => {
  // why async import?  see https://github.com/facebook/jest/issues/10025#issuecomment-716789840
  const module = await import('../PublicProfile')
  PublicProfile = module.default
})

test('PublicProfile when the user has logged in', async () => {
  mockedUseSession
    .mockClear()
    .mockReturnValue({ status: 'authenticated' })

  render(<PublicProfile userProfile={userProfile} />)

  expect(mockedUseSession).toBeCalledTimes(1)
  expect(screen.queryByRole('button')).toBeDefined()

  expect(screen.queryByText(userProfile.name)).not.toBeNull()
  expect(screen.queryByText(userProfile.nick)).not.toBeNull()
  expect(screen.queryByText(userProfile.bio)).not.toBeNull()
})

test('EditProfileButton null when the user hasn\'t logged in', async () => {
  mockedUseSession
    .mockClear()
    .mockReturnValue({ status: '' })

  render(<PublicProfile userProfile={userProfile} />)

  expect(mockedUseSession).toBeCalledTimes(1)
  expect(screen.queryByRole('button')).toBeNull()

  expect(screen.queryByText(userProfile.name)).not.toBeNull()
  expect(screen.queryByText(userProfile.nick)).not.toBeNull()
  expect(screen.queryByText(userProfile.bio)).not.toBeNull()
})
