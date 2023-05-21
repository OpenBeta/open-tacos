import { gql } from '@apollo/client'
import { FRAGMENT_MEDIA_WITH_TAGS } from './tags'

export const QUERY_USER_MEDIA = gql`
  ${FRAGMENT_MEDIA_WITH_TAGS}
  query ($userUuid: ID!, $maxFiles: Int) {
    getUserMedia(input: { userUuid: $userUuid, maxFiles: $maxFiles } ) {
      ... MediaWithTagsFields
    }
  }
`

export const QUERY_DOES_USERNAME_EXIST = gql`
query ($username: String!) {
  usernameExists(username: $username)
}
`
