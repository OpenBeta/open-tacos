export interface IReadOnlyUserMetadata {
  uuid: string
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
}
