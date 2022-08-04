import { Tick } from '../../pages/api/user/metadataClient'

export interface IReadOnlyUserMetadata {
  uuid: string
  roles: string[]
  loginsCount: number
}

export interface IWritableUserMetadata {
  name: string
  nick: string
  bio: string
  website?: string
  ticksImported?: boolean
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
    /**
     * This is a collection of user-ticks
     * These ticks can be imported from mountain project, or created by the user
     * A climb is ticked when a user completes it, or attempts it and wants to record the attempt
     * The key of a tick is the climbs UUID on Open-Tacos
     * The values are declared above in the tick interface
     */
    tickCollections?: { [key: string]: Tick[]}
  }
}

export type IUserMetadata = IWritableUserMetadata & IReadOnlyUserMetadata

export interface IUserProfile extends IUserMetadata {
  email?: string
  avatar?: string
  authProviderId: string
}

export interface WithOwnerProfile {
  ownerProfile: IUserProfile
}

export interface WithPermission {
  isAuthorized: boolean
  isAuthenticated: boolean
}
