import { gql } from '@apollo/client'

import { FRAGMENT_CHANGE_HISTORY } from './contribs'

export const QUERY_AREA_BY_ID = gql`
  ${FRAGMENT_CHANGE_HISTORY}
  query ($uuid: ID) {
    area(uuid: $uuid) {
      id
      uuid
      areaName
      shortCode
      ancestors
      pathTokens
      metadata {
        lat
        lng 
        leaf
        bbox
        areaId
      } 
      content {
        description 
      } 
      aggregate {
          byGradeBand {
            intermediate
            expert
            beginner
            advanced
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

      totalClimbs

      children {
        id
        uuid
        areaName
        aggregate {
          byGradeBand {
            intermediate
            expert
            beginner
            advanced
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
          }
        }
        children {
          id
        }
        totalClimbs
        content {
          description 
        } 
        metadata {
          areaId
          leaf
          lat
          lng
        }
      }

      climbs {
        id
      }

      media {
        mediaUrl
        mediaUuid
        destination
        destType
      }
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
      left_right_index
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
