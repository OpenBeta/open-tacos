import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'

import { reshapeAuth0UserToProfile, extractUpdatableMetadataFromProfile, auth0ManagementClient } from '../../../js/auth/ManagementClient'
import { IUserProfile } from '../../../js/types/User'

const allowedFields = ['name', 'nick', 'bio', 'website', 'ticksImported', 'collections'] as const
type AllowedField = typeof allowedFields[number]

const isString = (value: any): value is string => typeof value === 'string'
const isBoolean = (value: any): value is boolean => typeof value === 'boolean'

const dataTypeCheck: { [field in AllowedField]: (value: any) => boolean } = {
  name: isString,
  nick: isString,
  bio: isString,
  website: isString,
  ticksImported: isBoolean,
  collections: (value: any) => typeof value === 'object' && value != null
}
/**
 * This is the interface for the tick object
 * We are starting with name, uuid, notes
 * 
 */

export interface Tick {
  name: string,
  notes: string,
  uuid: string,
  style: string,
  attemptType: string,
  dateClimbed: string,
  grade: string
}

export interface Auth0UserMetadata {
  name?: string
  nick?: string
  uuid?: string
  bio?: string
  website?: string
  ticksImported?: boolean
  collections?: {
    /** Users can organize entities into their own 'climbing playlists'
     * Strictly speaking, this should always be mutated as a SET rather than an
     * array. JSON does not support set serialization, but we ideally wish to minimize
     * the actual space, so do whatever needs to be done to avoid ID duplicates.
     * The key of each collection is its name.
     */
    climbCollections?: {[key: string]: string[]}
    /**
     * Areas are seperated into their own collection rather than mixing them in with
     * the climbs. Partially because they are different entities altogether, and partly
     * because it seems sensible to me.
     * The key of each collection is its name.
     */
    areaCollections?: { [key: string]: string[] }
  }
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

  const getUserMetadata = async (): Promise<Auth0UserMetadata> => {
    const user = await auth0ManagementClient.getUser({ id })
    return reshapeAuth0UserToProfile(user)
  }

  /**
   * Push new values into the metadata store
   */
  const updateUserMetadata = async (
    profile: IUserProfile
  ): Promise<Auth0UserMetadata> => {
    const metadata = extractUpdatableMetadataFromProfile(profile)

    // Check again that all fields are above board in terms of their types
    // and names. prevents a user from injecting arbitrary data into the store
    // by changing a valid field into an object. (Like submitting an object for
    // their bio)
    Object.keys(metadata).forEach((field: AllowedField) => {
      // Check the field is allowed
      if (!allowedFields.includes(field)) {
        throw new Error(`Invalid field ${field}`)
      }
      // Check the field is above board
      if (!dataTypeCheck[field](metadata[field])) {
        throw new Error(`Invalid data type for field ${field}`)
      }
    })

    // The auth0 management client only touches properties that
    // are actually specified in metadata. So an undefined property
    // is passed over, not nulled, by Auth0
    const currentMeta = await getUserMetadata()
    if (currentMeta.nick === metadata.nick) {
      delete currentMeta.nick
    }

    // Actually write this new data into the users profile.
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
