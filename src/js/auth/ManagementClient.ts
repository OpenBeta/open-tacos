import { ManagementClient as Auth0MgmtClient } from 'auth0'

import { AUTH_CONFIG_SERVER } from '../../Config'
import { IUserProfile } from '../types/IUserProfile'

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

  const { user_metadata: umeta } = users[0]
  if (umeta == null) throw new Error('Missing metadata for ' + nick)

  return {
    fullName: umeta.name,
    nick: umeta.nick,
    uuid: umeta.uuid,
    email: users[0].email ?? '',
    avatar: users[0].picture,
    bio: umeta.bio
  }
}
