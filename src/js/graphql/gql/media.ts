import { gql } from '@apollo/client'
import { MediaWithTags } from '../../types'
import { AddEntityTagProps, FRAGMENT_MEDIA_WITH_TAGS } from './tags'

export type NewMediaObjectInput = Pick<MediaWithTags, 'mediaUrl' | 'width' | 'height' | 'format' | 'size'> & {
  userUuid: string
  entityTags?: Array<Omit<AddEntityTagProps, 'mediaId'>>
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
