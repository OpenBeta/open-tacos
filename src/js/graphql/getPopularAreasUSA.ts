import { gql } from '@apollo/client'

import { FRAGMENT_MEDIA_WITH_TAGS } from './gql/tags'
import { graphqlClient } from './Client'
import { IndexResponseType, AreaType } from '../types'

/**
 * Get high density areas in the US
 */
const query = gql`
  ${FRAGMENT_MEDIA_WITH_TAGS}
  query UsaAreas( $filter: Filter) {
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

export const getPopularAreasInUSA = async (): Promise<IndexResponseType> => {
  const rs = await graphqlClient.query<IndexResponseType>({
    query,
    variables: {
      filter: {
        field_compare: [{
          field: 'totalClimbs',
          num: 400,
          comparison: 'gt'
        }, {
          field: 'density',
          num: 0.5,
          comparison: 'gt'
        }]
      }
    }
  })
  return rs.data
}

const US_STATES = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']

export interface StateDataProps {
  name: string
  uuid?: string
  areas: AreaType[]
}

export const getUSATableOfContent = async (): Promise<Map<string, StateDataProps>> => {
  const highDensityList = await getPopularAreasInUSA()

  const stateMap = new Map<string, StateDataProps>()

  for (const state of US_STATES) {
    stateMap.set(state.toLowerCase(), {
      name: state,
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
