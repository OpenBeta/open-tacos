import { ManagementClient as Auth0MgmtClient, GetUsers200ResponseOneOfInner, GetOrganizationMemberRoles200ResponseOneOfInner, ApiResponse } from 'auth0'
import type { GetUsers200ResponseOneOf } from 'auth0'
import { AUTH_CONFIG_SERVER } from '../../Config'
import { IUserMetadataOriginal } from '../types/User'

if (AUTH_CONFIG_SERVER == null) throw new Error('AUTH_CONFIG_SERVER not defined')

const { mgmtClientId, mgmtClientSecret, mgmtClientAudience, issuer, clientId } = AUTH_CONFIG_SERVER

export const auth0ManagementClient = new Auth0MgmtClient({
  domain: issuer.replace('https://', ''),
  clientId: mgmtClientId,
  clientSecret: mgmtClientSecret,
  audience: mgmtClientAudience
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
}: GetAllUserParams): Promise<GetUsers200ResponseOneOf | null> => {
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

  const userPage = await auth0ManagementClient.users.getAll({
    q,
    page,
    per_page: 50,
    search_engine: 'v3',
    include_totals: true
  })

  return userPage.data
}

/**
 * See https://auth0.com/docs/api/management/v2#!/Jobs/post_verification_email
 * @param userId Auth0 internal user id. Ex: auth0|234879238023482995
 */
export const sendEmailVerification = async (userId: string): Promise<void> => {
  await auth0ManagementClient.jobs.verifyEmail({ user_id: userId, client_id: clientId })
}

/**
 * Retrieves roles the user is assigned. Returns at most 50 roles.
 * @param userId Auth0 internal user id. Ex: auth0|234879238023482995
 */
export const getUserRoles = async (userId: string): Promise<ApiResponse<GetOrganizationMemberRoles200ResponseOneOfInner[]>> => {
  return await auth0ManagementClient.users.getRoles({ id: userId, page: 0, per_page: 50 })
}

/**
 * Sets roles for the user, making multiple calls to Auth0 since there is no consolidated set call.
 * @param userId Auth0 internal user id. Ex: auth0|234879238023482995
 * @param roles Array of role names (Ex: 'editor'), not Auth0 role IDs (Ex: 'rol_ds239fjdsfsd')
 */
export const setUserRoles = async (userId: string, roles: string[]): Promise<void> => {
  const allRoles = await auth0ManagementClient.users.getRoles()
  const roleIdsToRemove = allRoles.data.reduce<string[]>((res, roleObj) => {
    if (roleObj.name != null && roleObj.id != null && !roles.includes(roleObj.name)) {
      res.push(roleObj.id)
    }
    return res
  }, [])
  // Removes roles that the user doesn't even have, but that's ok.
  if (roleIdsToRemove.length > 0) await auth0ManagementClient.users.deleteRoles({ id: userId }, { roles: roleIdsToRemove })

  const roleIdsToAssign = allRoles.data.reduce<string[]>((res, roleObj) => {
    if (roleObj.name != null && roleObj.id != null && roles.includes(roleObj.name)) {
      res.push(roleObj.id)
    }
    return res
  }, [])
  if (roleIdsToAssign.length > 0) await auth0ManagementClient.users.assignRoles({ id: userId }, { roles: roleIdsToAssign })
}

/**
 * For admins to update user metadata, including read-only portions.
 * Extendable to update other fields in future.
 * @param userId Auth0 internal user id. Ex: auth0|234879238023482995
 * @param userMetadata Fields to be updated
 */
export const updateUser = async (userId: string, userMetadata: Partial<IUserMetadataOriginal>): Promise<GetUsers200ResponseOneOfInner> => {
  const res = await auth0ManagementClient.users.update({ id: userId }, { user_metadata: userMetadata })
  return res.data
}
