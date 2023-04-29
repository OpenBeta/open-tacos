import { gql } from '@apollo/client'
import { FRAGMENT_MEDIA_WITH_TAGS } from './tags'
export const QUERY_USER_MEDIA = gql`
  ${FRAGMENT_MEDIA_WITH_TAGS}
  query ($userUuid: ID!, $limit: Int) {
    getUserMedia(userUuid: $userUuid, limit: $limit ) {
      ... MediaWithTagsFields
    }
  }
`
