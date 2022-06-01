import { ManagementClient as Auth0MgmtClient } from 'auth0'
import type { User } from 'auth0'
import { AUTH_CONFIG_SERVER } from '../../Config'
import { IWritableUserMetadata, IUserProfile } from '../types/User'

if (AUTH_CONFIG_SERVER == null) throw new Error('AUTH_CONFIG_SERVER not defined')

const { mgmtClientId, mgmtClientSecret, issuer } = AUTH_CONFIG_SERVER

const auth0ManagementClient = new Auth0MgmtClient({
  domain: issuer.replace('https://', ''),
  clientId: mgmtClientId,
  clientSecret: mgmtClientSecret,
  scope: 'read:users'
})

export const getAllUsersMetadata = async (): Promise<any[]> => {
  const users = await auth0ManagementClient.getUsers({ q: 'user_metadata.uuid=*' })
  return users
}

export const getUserProfileByNick = async (nick: string): Promise<IUserProfile> => {
  const users = await auth0ManagementClient.getUsers({ q: `user_metadata.nick="${nick}"` })

  if (users == null) throw new Error('User not found')

  if (users != null && users.length > 1) throw new Error('Found multiple users for ' + nick)

  return reshapeAuth0UserToProfile(users[0])
}

export const reshapeAuth0UserToProfile = (user: User): IUserProfile => {
  const { user_metadata: umeta } = user
  if (umeta == null) throw new Error(`Missing metadata for  ${user?.name ?? ''}`)
  return {
    name: umeta?.name ?? '',
    nick: umeta.nick,
    uuid: umeta.uuid,
    email: user.email ?? '',
    avatar: user?.picture ?? '',
    bio: umeta?.bio ?? ''
  }
}

export const extractUpdatableMetadataFromProfile = ({ name, nick, bio }: IWritableUserMetadata): IWritableUserMetadata => ({
  name,
  nick,
  bio
})
