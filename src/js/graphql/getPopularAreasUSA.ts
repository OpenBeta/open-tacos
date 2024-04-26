import { gql } from '@apollo/client'

import { FRAGMENT_MEDIA_WITH_TAGS } from './gql/tags'
import { getClientForServerComponent } from './ServerClient'

import { AreaType } from '../types'

/**
 * - Get all US states
 * - Get high density areas in the US
 */
const query = gql`
  ${FRAGMENT_MEDIA_WITH_TAGS}
  query UsaAreas( $filter: Filter) {
    area(uuid: "1db1e8ba-a40e-587c-88a4-64f5ea814b8e") {
      totalClimbs
      uuid
      children {
        areaName
        uuid
        totalClimbs
      }
    }
    areas(filter: $filter, sort: { totalClimbs: -1 }) {
      id
      uuid
      areaName
      pathTokens
      ancestors
      totalClimbs
      density
      aggregate {
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
            tr {
              total
            }
            alpine {
              total
            }
            mixed {
              total
            }
            aid {
              total
            }
          }
      }
      metadata {
        lat
        lng
        areaId
      }
      media {
         ... MediaWithTagsFields
      }
    }
  }`

interface StateSimpleStatsProps {
  /** State name */
  areaName: string
  uuid: string
  totalClimbs: number
}
export interface USAToCProps {
  area: {
    uuid: string
    children: StateSimpleStatsProps[]
  }
  areas: AreaType[]
}

export const getPopularAreasInUSA = async (): Promise<USAToCProps> => {
  const rs = await getClientForServerComponent().query<USAToCProps>({
    query,
    variables: {
      filter: {
        field_compare: [{
          field: 'totalClimbs',
          num: 200,
          comparison: 'gt'
        }, {
          field: 'density',
          num: 0.8,
          comparison: 'gt'
        }]
      }
    }
  })
  return rs.data
}

export interface StateDataProps {
  name: string
  uuid: string
  totalClimbs: number
  areas: AreaType[]
}

export const getUSATableOfContent = async (): Promise<Map<string, StateDataProps>> => {
  const highDensityList = await getPopularAreasInUSA()

  const stateMap = new Map<string, StateDataProps>()

  for (const state of highDensityList.area.children) {
    const { areaName, totalClimbs, uuid } = state
    if (process.env.NEXT_PUBLIC_TEST_AREA_IDS?.match(uuid) != null) {
      continue
    }
    stateMap.set(state.areaName.toLowerCase(), {
      name: areaName,
      totalClimbs,
      uuid,
      areas: []
    })
  }

  for (const area of highDensityList.areas) {
    const { pathTokens, ancestors } = area
    if (pathTokens.length < 2) continue
    const state = pathTokens[1]
    const stateData = stateMap.get(state.toLowerCase())
    if (stateData != null) {
      stateData.uuid = ancestors[1]
      stateData.areas.push(area)
    }
  }
  return stateMap
}
