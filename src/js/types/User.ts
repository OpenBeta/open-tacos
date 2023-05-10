export enum UserRole { // These need to match https://manage.auth0.com/dashboard/us/dev-fmjy7n5n/roles.
  EDITOR = 'editor',
  ORG_ADMIN = 'org_admin',
  USER_ADMIN = 'user_admin',
}

// Read-only to the user; potentially writable by admins in Basecamp.
export interface IReadOnlyUserMetadata {
  uuid: string
  loginsCount: number
  /* Denotes the organizations that users that have the 'org_admin' role
   * are administering. Those without the role will have this as undefined.
   */
  orgAdminOrgIds?: string[]
}

export interface IWritableUserMetadata {
  name: string
  nick: string
  bio: string
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

/**
 * `user_metadata` as seen in the Auth0 datastore,
 * before we add fields during post-login actions.
 */
export type IUserMetadataOriginal = IWritableUserMetadata & IReadOnlyUserMetadata

/* `roles` are added by a post-login action and are not in
 * the user's `user_metadata` object in Auth0.
 */
export type IUserMetadata = IUserMetadataOriginal & {
  roles: UserRole[]
}

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
