import { gql } from '@apollo/client'

import { getClient } from './ServerClient'

import { AreaType } from '../types'

/**
 * - Get all US states
 * - Get high density areas in the US
 */
const query = gql`
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
  const rs = await getClient().query<USAToCProps>({
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

/** Default maximum number of child areas to include per state in USA table of contents */
export const DEFAULT_MAX_AREAS_PER_STATE = 5

/**
 * Build USA Table of Content map with an optional limit on child areas per state
 *
 * @param highDensityList - Data containing USA children states and high density areas
 * @param maxAreasPerState - Maximum number of child areas to include per state (default: 5)
 */
export const buildUSATableOfContent = (
  highDensityList: USAToCProps,
  maxAreasPerState: number = DEFAULT_MAX_AREAS_PER_STATE
): Map<string, StateDataProps> => {
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
      if (maxAreasPerState <= 0 || stateData.areas.length < maxAreasPerState) {
        stateData.areas.push(area)
      }
    }
  }
  return stateMap
}

export const getUSATableOfContent = async (
  maxAreasPerState: number = DEFAULT_MAX_AREAS_PER_STATE
): Promise<Map<string, StateDataProps>> => {
  const highDensityList = await getPopularAreasInUSA()
  return buildUSATableOfContent(highDensityList, maxAreasPerState)
}
