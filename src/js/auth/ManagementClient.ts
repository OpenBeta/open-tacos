import { ManagementClient as Auth0MgmtClient } from 'auth0'
import type { User, UserPage, Role } from 'auth0'
import { AUTH_CONFIG_SERVER } from '../../Config'
import { IWritableUserMetadata, IUserProfile, IUserMetadataOriginal } from '../types/User'

if (AUTH_CONFIG_SERVER == null) throw new Error('AUTH_CONFIG_SERVER not defined')

const { mgmtClientId, mgmtClientSecret, issuer, clientId } = AUTH_CONFIG_SERVER

export const auth0ManagementClient = new Auth0MgmtClient({
  domain: issuer.replace('https://', ''),
  clientId: mgmtClientId,
  clientSecret: mgmtClientSecret,
  scope: 'read:users update:users create:users read:roles'
})

interface GetAllUserParams {
  page: number
  connectionType: string
  email?: string
  legacy?: boolean
}

export const getAllUsersMetadata = async ({
  page = 1,
  connectionType = 'auth0',
  email = '',
  legacy = false
}: GetAllUserParams): Promise<UserPage | null> => {
  let q = 'user_metadata.uuid=*'
  if (legacy) {
    q = ''
  }

  if (email !== '') {
    q = q + ` AND email=*${email}*`
  }

  if (['email', 'auth0'].includes(connectionType)) {
    q = q + ` AND user_id=${connectionType}*`
  } else {
    throw new Error('Invalid type.  Expect auth0 or email.')
  }

  const userPage = await auth0ManagementClient.getUsers({
    q,
    page,
    per_page: 50,
    search_engine: 'v3',
    include_totals: true
  })
  return userPage
}

export const getUserProfileByNick = async (nick: string): Promise<IUserProfile> => {
  const users = await auth0ManagementClient.getUsers({ q: `user_metadata.nick="${nick}"` })

  if (users == null || (users != null && users.length === 0)) throw new Error('User not found')

  //  previous passwordless account
  const newEmailPasswordUsers = users.filter(u => u.user_id?.startsWith('auth0'))
  if (newEmailPasswordUsers.length > 1) throw new Error('Found multiple users for ' + nick)

  return reshapeAuth0UserToProfile(newEmailPasswordUsers[0])
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
    ticksImported: umeta?.ticksImported ?? false,
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

export const extractUpdatableMetadataFromProfile = ({ name, nick, bio, website, ticksImported, collections }: IWritableUserMetadata): IWritableUserMetadata => ({
  name,
  nick,
  bio,
  website,
  ticksImported,
  collections
})

/**
 * See https://auth0.com/docs/api/management/v2#!/Jobs/post_verification_email
 * @param userId Auth0 internal user id. Ex: auth0|234879238023482995
 */
export const sendEmailVerification = async (userId: string): Promise<void> => {
  await auth0ManagementClient.sendEmailVerification({ user_id: userId, client_id: clientId })
}

/**
 * Retrieves roles the user is assigned. Returns at most 50 roles.
 * @param userId Auth0 internal user id. Ex: auth0|234879238023482995
 */
export const getUserRoles = async (userId: string): Promise<Role[]> => {
  return await auth0ManagementClient.getUserRoles({ id: userId, page: 0, per_page: 50 })
}

/**
 * Sets roles for the user, making multiple calls to Auth0 since there is no consolidated set call.
 * @param userId Auth0 internal user id. Ex: auth0|234879238023482995
 * @param roles Array of role names (Ex: 'editor'), not Auth0 role IDs (Ex: 'rol_ds239fjdsfsd')
 */
export const setUserRoles = async (userId: string, roles: string[]): Promise<void> => {
  const allRoles = await auth0ManagementClient.getRoles()

  const roleIdsToRemove = allRoles.reduce<string[]>((res, roleObj) => {
    if (roleObj.name != null && roleObj.id != null && !roles.includes(roleObj.name)) {
      res.push(roleObj.id)
    }
    return res
  }, [])
  // Removes roles that the user doesn't even have, but that's ok.
  if (roleIdsToRemove.length > 0) await auth0ManagementClient.removeRolesFromUser({ id: userId }, { roles: roleIdsToRemove })

  const roleIdsToAssign = allRoles.reduce<string[]>((res, roleObj) => {
    if (roleObj.name != null && roleObj.id != null && roles.includes(roleObj.name)) {
      res.push(roleObj.id)
    }
    return res
  }, [])
  if (roleIdsToAssign.length > 0) await auth0ManagementClient.assignRolestoUser({ id: userId }, { roles: roleIdsToAssign })
}

/**
 * For admins to update user metadata, including read-only portions.
 * Different from updateUserProfile in CurrentUserClientEasily
 * which is for users to update their own data.
 * Extendable to update other fields in future.
 * @param userId Auth0 internal user id. Ex: auth0|234879238023482995
 * @param userMetadata Fields to be updated
 */
export const updateUser = async (userId: string, userMetadata: Partial<IUserMetadataOriginal>): Promise<User> => {
  return await auth0ManagementClient.updateUser({ id: userId }, { user_metadata: userMetadata })
}
