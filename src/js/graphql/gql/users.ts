import { gql } from '@apollo/client'

export const QUERY_USER_MEDIA = gql`
  query ($userUuid: ID!, $limit: Int) {
    getUserMedia(userUuid: $userUuid, limit: $limit ) {
      mediaUrl
      height
      width
      birthTime
      climbTags {
        name
        id
        type
      }
      areaTags {
        id
        name
        type
      }
    }
  }
`
