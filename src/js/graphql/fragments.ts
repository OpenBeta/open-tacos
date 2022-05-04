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
 * Create a media <--> climb (or area) association
 */
export const TAG_CLIMB = gql`
  mutation tagPhotoWithClimb($mediaUuid: ID!, $mediaUrl: String!, $srcUuid: ID!) {
    setTags(
      input: {
        mediaUuid: $mediaUuid,
        mediaUrl: $mediaUrl,
        mediaType: 0,
        srcUuid: $srcUuid,
        srcType: 0
      }
    ) {
        srcUuid
        srcType
      }
  }`

export const QUERY_TAGS_BY_MEDIA_ID = gql`
  query getTagsByMediaId($mediaUuid: ID!) {
    getTagsByMediaId(uuid: $mediaUuid) {
      mediaType
      mediaUrl
      mediaUuid
      srcUuid
      srcType
    }
  }
`
