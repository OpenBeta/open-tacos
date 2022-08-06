import { ManagementClient as Auth0MgmtClient } from 'auth0'
import type { User } from 'auth0'
import { AUTH_CONFIG_SERVER } from '../../Config'
import { IWritableUserMetadata, IUserProfile } from '../types/User'

if (AUTH_CONFIG_SERVER == null) throw new Error('AUTH_CONFIG_SERVER not defined')

const { mgmtClientId, mgmtClientSecret, issuer } = AUTH_CONFIG_SERVER

export const auth0ManagementClient = new Auth0MgmtClient({
  domain: issuer.replace('https://', ''),
  clientId: mgmtClientId,
  clientSecret: mgmtClientSecret,
  scope: 'read:users update:users'
})

export const getAllUsersMetadata = async (legacy: boolean = false): Promise<any[]> => {
  let q = 'user_metadata.uuid=*'
  if (legacy) {
    q = ''
  }
  const users = await auth0ManagementClient.getUsers({ q })
  return users
}

export const getUserProfileByNick = async (nick: string): Promise<IUserProfile> => {
  const users = await auth0ManagementClient.getUsers({ q: `user_metadata.nick="${nick}"` })

  if (users == null || (users != null && users.length === 0)) throw new Error('User not found')

  if (users != null && users.length > 1) throw new Error('Found multiple users for ' + nick)

  return reshapeAuth0UserToProfile(users[0])
}

export const reshapeAuth0UserToProfile = (user: User): IUserProfile => {
  const { user_metadata: umeta } = user
  if (umeta == null || user?.user_id == null || umeta?.uuid == null) throw new Error(`Missing auth provider ID and metadata for  ${user?.name ?? ''}`)
  return {
    authProviderId: user.user_id,
    name: umeta?.name ?? '',
    nick: umeta.nick,
    uuid: umeta.uuid,
    email: user.email ?? '',
    avatar: user?.picture ?? '',
    bio: umeta?.bio ?? '',
    roles: umeta?.roles ?? [],
    loginsCount: umeta?.loginsCount ?? 0,
    website: umeta?.website ?? '',
    collections: umeta.collections ?? {}
  }
}

/**
 * Given a nick name, return true if it's already in use by another other user.
 * @param nick user name
 * @returns true
 */
export const doesUserNameExist = async (nick: string): Promise<boolean> => {
  const users = await auth0ManagementClient
    .getUsers({
      q: `user_metadata.nick="${nick}"`,
      include_fields: true,
      fields: 'email'
    })
  if (users != null) {
    switch (users.length) {
      case 0: return false
      case 1: return true
      default: throw new Error('#### Oops, multiple nick names found.  This should not happend! ####')
    }
  }
  // API error
  throw new Error('Unable to search the user database')
}

export const extractUpdatableMetadataFromProfile = ({ name, nick, bio, website, collections }: IWritableUserMetadata): IWritableUserMetadata => ({
  name,
  nick,
  bio,
  website,
  collections
})
