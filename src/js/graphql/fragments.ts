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

export const TAG_CLIMB = gql`
  mutation tagPhotoWithClimb($mediaId: ID!, $mediaUrl: String!, $srcUuid: ID!) {
    setTags(input: {mediaId: $mediaId, mediaUrl: $mediaUrl, mediaType: 0, sources: [{srcUuid: $srcUuid, srcType: 0}]}) {
      mediaId
    }
  }
`
