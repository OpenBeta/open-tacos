import { gql } from '@apollo/client'

import { FRAGMENT_MEDIA_WITH_TAGS } from './tags'
import { FRAGMENT_AUTHOR_METADATA } from './contribs'

/**
 * A reusable fragment for climb disciplines
 */
export const FRAGMENT_CLIMB_DISCIPLINES = gql`
 fragment ClimbDisciplineFields on GradeType {
    ewbank
    font
    french
    vscale
    yds
    uiaa
  }`

export const QUERY_CLIMB_BY_ID = gql`
  ${FRAGMENT_CLIMB_DISCIPLINES}
  ${FRAGMENT_MEDIA_WITH_TAGS}
  ${FRAGMENT_AUTHOR_METADATA}
  query ClimbByUUID($id: ID) {
    climb(uuid: $id) {
      id
      uuid
      name
      fa
      length
      yds
      grades {
        ...ClimbDisciplineFields
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
      authorMetadata {
        ... AuthorMetadataFields
      }
    }
  }`
