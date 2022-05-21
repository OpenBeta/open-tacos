import { ManagementClient } from 'auth0'
import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'

import { AUTH_CONFIG_SERVER } from '../../../Config'

const allowedFields = ['name'] as const
type AllowedField = typeof allowedFields[number]

const isString = (value: any): value is string => typeof value === 'string'

const dataTypeCheck: { [field in AllowedField]: (value: any) => boolean } = {
  name: isString
}

export interface UserMetadata {
  name?: string
}

interface MetadataClient {
  getUserMetadata: () => Promise<UserMetadata>
  updateUserMetadata: (metadata: UserMetadata) => Promise<UserMetadata>
}

const createMetadataClient = async (
  req: NextApiRequest
): Promise<MetadataClient|null> => {
  const session = await getSession({ req })
  const { id, accessToken } = session as unknown as {id: string, accessToken: string}

  if (accessToken == null) {
    return null
  }

  const currentUserManagementClient = new ManagementClient({
    domain: AUTH_CONFIG_SERVER?.issuer.replace('https://', '') ?? '',
    token: accessToken
  })

  const getUserMetadata = async (): Promise<UserMetadata> => {
    const user = await currentUserManagementClient.getUser({ id })
    return user?.user_metadata ?? {}
  }

  const updateUserMetadata = async (
    metadata: UserMetadata
  ): Promise<UserMetadata> => {
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
