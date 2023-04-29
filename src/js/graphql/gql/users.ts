import { gql } from '@apollo/client'

export const QUERY_USER_MEDIA = gql`
  query ($userUuid: ID!) {
    getUserMedia(userUuid: $userUuid) {
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
