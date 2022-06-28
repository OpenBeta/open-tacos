export interface IReadOnlyUserMetadata {
  uuid: string
  roles: string[]
}

export interface IWritableUserMetadata {
  name: string
  nick: string
  bio: string
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
