import { gql } from '@apollo/client'

import { FRAGMENT_AUTHOR_METADATA, FRAGMENT_CHANGE_HISTORY } from './contribs'
import { FRAGMENT_MEDIA_WITH_TAGS } from './tags'
import { FRAGMENT_CLIMB_DISCIPLINES } from './climbById'

export const QUERY_AREA_BY_ID = gql`
  ${FRAGMENT_CLIMB_DISCIPLINES}
  ${FRAGMENT_CHANGE_HISTORY}
  ${FRAGMENT_MEDIA_WITH_TAGS}
  ${FRAGMENT_AUTHOR_METADATA}
  query ($uuid: ID) {
    area(uuid: $uuid) {
      id
      uuid
      areaName
      gradeContext
      media {
        ... MediaWithTagsFields
      }
      totalClimbs
      aggregate {
        byGrade {
          count
          label
        }
        byDiscipline {
            sport {
              total
            }
            trad {
              total
            }
            boulder {
              total
            }
            aid {
              total
            }
          }
      }
      metadata {
        areaId
        leaf
        isBoulder
        lat
        lng 
        leftRightIndex
        polygon
        bbox
      }
      pathTokens  
      ancestors
      organizations {
        orgId
        orgType
        associatedAreaIds
        displayName
        content {
          description
          donationLink
          email
          facebookLink
          hardwareReportLink
          instagramLink
          website
        }
      }
      climbs {
        id
        name
        fa
        grades {
          ...ClimbDisciplineFields
        }
        safety
        type {
          trad
          tr
          sport
          mixed
          bouldering
          alpine
          aid
        }
        metadata {
          climbId
          leftRightIndex
        }
        content {
          description
        }
      }
      children {
        uuid
        areaName
        totalClimbs
        metadata {
          areaId
          leaf
          isBoulder
          leftRightIndex
          lat
          lng
          bbox
          polygon
        }
        children {
          uuid
        }
        climbs {
          id
        }
      }
      content {
        description
      }
      authorMetadata {
        ... AuthorMetadataFields
      }
    }
    getAreaHistory(filter: {areaId: $uuid}) {
       ...ChangeHistoryFields
    }
  }
  `

/**
 * Why having 2 nearly identical queries?
 * TODO:  Combine this one and the main one above
 */
export const QUERY_AREA_FOR_EDIT = gql`
${FRAGMENT_CLIMB_DISCIPLINES}
${FRAGMENT_MEDIA_WITH_TAGS}
query AreaByID($uuid: ID) {
  area(uuid: $uuid) {
    id
    uuid
    areaName
    gradeContext
    media {
      ... MediaWithTagsFields
    }
    metadata {
      areaId
      leaf
      isBoulder
      lat
      lng 
      leftRightIndex
    }
    pathTokens  
    ancestors
    totalClimbs
    climbs {
      id
      name
      fa
      grades {
        ...ClimbDisciplineFields
      }
      safety
      type {
        trad
        tr
        sport
        mixed
        bouldering
        alpine
        aid
      }
      metadata {
        climbId
        leftRightIndex
      }
      content {
        description
      }
    }
    children {
      uuid
      areaName
      totalClimbs
      children {
        uuid
      }
      climbs {
        id
      }
      metadata {
        leaf
        isBoulder
      }
    }
    content {
      description 
    } 
  }
}`
