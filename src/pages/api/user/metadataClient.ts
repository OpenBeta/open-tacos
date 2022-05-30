import { ManagementClient } from 'auth0'
import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'

import { AUTH_CONFIG_SERVER } from '../../../Config'
import { reshapeAuth0UserToProfile, extractUpdatableMetadataFromProfile } from '../../../js/auth/ManagementClient'
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

  const currentUserManagementClient = new ManagementClient<any, Auth0UserMetadata>({
    domain: AUTH_CONFIG_SERVER?.issuer.replace('https://', '') ?? '',
    token: accessToken
  })

  const getUserMetadata = async (): Promise<Auth0UserMetadata> => {
    const user = await currentUserManagementClient.getUser({ id })
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

    const user = await currentUserManagementClient.updateUserMetadata(
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
