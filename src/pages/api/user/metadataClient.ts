import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'

import { reshapeAuth0UserToProfile, extractUpdatableMetadataFromProfile, auth0ManagementClient } from '../../../js/auth/ManagementClient'
import { IUserProfile } from '../../../js/types/User'

const allowedFields = ['name', 'nick', 'bio'] as const
type AllowedField = typeof allowedFields[number]

const isString = (value: any): value is string => typeof value === 'string'

const dataTypeCheck: { [field in AllowedField]: (value: any) => boolean } = {
  name: isString,
  nick: isString,
  bio: isString
}

export interface Auth0UserMetadata {
  name?: string
  nick?: string
  uuid?: string
  bio?: string
}
interface MetadataClient {
  getUserMetadata: () => Promise<Auth0UserMetadata>
  updateUserMetadata: (metadata: Auth0UserMetadata) => Promise<Auth0UserMetadata>
}

const createMetadataClient = async (
  req: NextApiRequest
): Promise<MetadataClient|null> => {
  const session = await getSession({ req })
  if (session == null) return null
  const { id, accessToken } = session as unknown as {id: string, accessToken: string}

  if (accessToken == null) {
    return null
  }

  // const currentUserManagementClient = new ManagementClient<any, Auth0UserMetadata>({
  //   domain: AUTH_CONFIG_SERVER?.issuer.replace('https://', '') ?? '',
  //   clientId: AUTH_CONFIG_SERVER?.clientId,
  //   clientSecret: AUTH_CONFIG_SERVER?.clientSecret,
  //   scope: 'read:users update:users'
  // })

  const getUserMetadata = async (): Promise<Auth0UserMetadata> => {
    const user = await auth0ManagementClient.getUser({ id })
    return reshapeAuth0UserToProfile(user)
  }

  const updateUserMetadata = async (
    profile: IUserProfile
  ): Promise<Auth0UserMetadata> => {
    const metadata = extractUpdatableMetadataFromProfile(profile)
    Object.keys(metadata).forEach((field: AllowedField) => {
      if (!allowedFields.includes(field)) {
        throw new Error(`Invalid field ${field}`)
      }
      if (!dataTypeCheck[field](metadata[field])) {
        throw new Error(`Invalid data type for field ${field}`)
      }
    })

    const user = await auth0ManagementClient.updateUserMetadata(
      { id },
      metadata
    )

    return user?.user_metadata ?? {}
  }

  return {
    getUserMetadata,
    updateUserMetadata
  }
}

export default createMetadataClient
