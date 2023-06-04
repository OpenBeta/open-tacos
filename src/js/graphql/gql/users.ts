import { gql } from '@apollo/client'
import { FRAGMENT_MEDIA_WITH_TAGS } from './tags'

// TODO: also get user profile
// change query to get user public page
export const QUERY_USER_MEDIA = gql`
  ${FRAGMENT_MEDIA_WITH_TAGS}
  query ($userUuid: ID!, $maxFiles: Int) {
    getUserMedia(input: { userUuid: $userUuid, maxFiles: $maxFiles }) {
      ... MediaWithTagsFields
    }
  }
`

export const QUERY_DOES_USERNAME_EXIST = gql`
query ($username: String!) {
  usernameExists(input: { username: $username })
}
`

export const QUERY_GET_USERNAME_BY_UUID = gql`
  query ($userUuid: ID!) {
    getUsername(input: { userUuid: $userUuid }) {
      userUuid
      username
      lastUpdated
    }
  }
`
export const QUERY_GET_USER_PUBLIC_PAGE = gql`
  ${FRAGMENT_MEDIA_WITH_TAGS}
  query ($username: String!) {
    getUserPublicPage(input: { username: $username }) {
      profile {
        bio
        displayName
        userUuid
        username
        website
        avatar
      }
      mediaList {
        ... MediaWithTagsFields
      }
    }
  }
`

export const MUTATION_UPDATE_USERNAME = gql`
  mutation ($username: String!, $userUuid: ID!, $email: String) {
    updateUserProfile(input: { userUuid: $userUuid, username: $username, email: $email })
  }`
