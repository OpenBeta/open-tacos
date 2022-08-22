import { gql } from '@apollo/client'

export const CORE_CRAG_FIELDS = gql`
  fragment CoreCragFields on Area {
    areaName
    id
    uuid
    totalClimbs
    pathTokens
    metadata {
      lat
      lng
      areaId
    }
    aggregate {
      byDiscipline {
        sport {
          total
          bands {
            advance
            beginner
            expert
            intermediate
          }
        }
        trad {
          total
          bands {
            advance
            beginner
            expert
            intermediate
          }
        }
        boulder {
          total
          bands {
            advance
            beginner
            expert
            intermediate
          }
        }
        tr {
          total
          bands {
            advance
            beginner
            expert
            intermediate
          }
        }
      }
      byGradeBand {
        advance
        beginner
        expert
        intermediate
      }
    }
  }
`

/**
 * Create a media <--> climb association
 *
 * dest type is 0 for climb and 1 for area
 */
export const MUTATION_ADD_CLIMB_TAG_TO_MEDIA = gql`
  mutation tagPhotoWithClimb($mediaUuid: ID!, $mediaUrl: String!, $srcUuid: ID!) {
    setTag(
      input: {
        mediaUuid: $mediaUuid,
        mediaUrl: $mediaUrl,
        mediaType: 0,
        destinationId: $srcUuid,
        destType: 0
      }
    ) {
        ... on ClimbTag {
          mediaUuid
          mediaUrl
          climb {
            id
            name
          }
        }
      }
  }`

/**
 * Create a media <-->  area association
 *
 * Explanation as to why there are two mutations:
 *  I don't know why, but the API was not happy with me generalizing the logic.
 *  I kept getting a 400-code error, I didn't track down why.
 */
export const MUTATION_ADD_AREA_TAG_TO_MEDIA = gql`
  mutation tagPhotoWithArea($mediaUuid: ID!, $mediaUrl: String!, $srcUuid: ID!) {
    setTag(
      input: {
        mediaUuid: $mediaUuid,
        mediaUrl: $mediaUrl,
        mediaType: 1,
        destinationId: $srcUuid,
        destType: 0
      }
    ) {
        ... on ClimbTag {
          mediaUuid
          mediaUrl
          climb {
            id
            name
          }
        }
      }
  }`

export const MUTATION_REMOVE_MEDIA_TAG = gql`
  mutation removeTag($mediaUuid: ID!, $destinationId: ID!) {
    removeTag(mediaUuid: $mediaUuid, destinationId: $destinationId) {
      mediaUuid
      destinationId
      removed
    }
  }`

export const QUERY_TAGS_BY_MEDIA_ID = gql`
  query getTagsByMediaIdList($uuidList: [ID!]) {
    getTagsByMediaIdList(uuidList: $uuidList) {
      ... on ClimbTag {
        mediaUuid
        mediaUrl
        climb {
          id
          name
        }
      }
    }
  }
`

export const QUERY_RECENT_MEDIA = gql`
  query ($userLimit: Int) {
    getRecentTags(userLimit: $userLimit) {
      authorUuid
      tagList {
        destType
        mediaUrl
        mediaType
        destination
      }
    }
  }
`

export const QUERY_CRAGS_WITHIN = gql`
  query ($filter: SearchWithinFilter) {
    cragsWithin(filter: $filter) {
      areaName
      uuid
      totalClimbs
      density
      metadata {
        lat
        lng
        areaId
        leaf
      }
    }
  }
`
