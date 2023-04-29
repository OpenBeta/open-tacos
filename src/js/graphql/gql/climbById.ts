import { gql } from '@apollo/client'

import { FRAGMENT_MEDIA_WITH_TAGS } from './tags'

export const QUERY_CLIMB_BY_ID = gql`
  ${FRAGMENT_MEDIA_WITH_TAGS}
  query ClimbByUUID($id: ID) {
    climb(uuid: $id) {
      id
      uuid
      name
      fa
      length
      yds
      grades {
        font
        french
        vscale
        yds
      }
      safety
      type {
        sport
        bouldering
        alpine
        tr
        trad
        mixed
        aid
      }
      media {
        ... MediaWithTagsFields
      }
      content {
        description
        location
        protection
      }
      pathTokens
      ancestors
      metadata {
        climbId
      }
      parent {
        gradeContext
        metadata {
          isBoulder
        }
      }
      createdAt
      createdBy
      updatedAt
      updatedBy
    }
  }`
