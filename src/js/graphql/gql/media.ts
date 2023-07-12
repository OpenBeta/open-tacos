import { gql } from '@apollo/client'
import { MediaWithTags } from '../../types'
import { AddEntityTagProps, FRAGMENT_MEDIA_WITH_TAGS } from './tags'

export type NewEmbeddedEntityTag = Omit<AddEntityTagProps, 'mediaId'>
export type NewMediaObjectInput = Pick<MediaWithTags, 'mediaUrl' | 'width' | 'height' | 'format' | 'size'> & {
  userUuid: string
  entityTag?: NewEmbeddedEntityTag
}

export interface AddNewMediaObjectsArgs {
  mediaList: NewMediaObjectInput[]
}

export interface AddMediaObjectsReturn {
  addMediaObjects: MediaWithTags[]
}

export const MUTATION_ADD_MEDIA_OBJECTS = gql`
${FRAGMENT_MEDIA_WITH_TAGS}
  mutation addMediaObjects($mediaList: [NewMediaObjectInput]) {
    addMediaObjects(
      input: $mediaList
    ) {
        ... MediaWithTagsFields
    }
  }`

export interface DeleteOneMediaObjectArgs {
  mediaId: string
}

export interface DeleteOneMediaObjectReturn {
  deleteMediaObject: boolean
}

export const MUTATION_DELETE_ONE_MEDIA_OBJECT = gql`
  mutation deleteMediaObject($mediaId: ID!) {
    deleteMediaObject(
      input: { mediaId: $mediaId}
    )
  }`
