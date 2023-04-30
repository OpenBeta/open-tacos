import { gql } from '@apollo/client'

import { FRAGMENT_CHANGE_HISTORY } from './contribs'
import { FRAGMENT_MEDIA_WITH_TAGS } from './tags'

export const QUERY_AREA_BY_ID = gql`
  ${FRAGMENT_CHANGE_HISTORY}
  ${FRAGMENT_MEDIA_WITH_TAGS}
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
      }
      pathTokens  
      ancestors
      climbs {
        id
        name
        fa
        grades {
          font
          french
          vscale
          yds
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
          leaf
          isBoulder
        }
        children {
          uuid
        }
      }
      content {
        description 
      }
      updatedAt
      updatedBy
      createdAt
      createdBy 
    }
    getAreaHistory(filter: {areaId: $uuid}) {
       ...ChangeHistoryFields
    }
  }
  `

export const QUERY_AREA_FOR_EDIT = gql`query AreaByID($uuid: ID) {
  area(uuid: $uuid) {
    id
    uuid
    areaName
    gradeContext
    media {
      username
      mediaUrl
      mediaUuid
      destination
      destType
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
        font
        french
        vscale
        yds
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
