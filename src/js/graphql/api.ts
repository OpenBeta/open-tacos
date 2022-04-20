import { gql } from '@apollo/client'
import { AreaType } from '../types'
import { graphqlClient } from './Client'

interface CragsDetailsNearType {
  data: Array<Partial<AreaType>>
  placeId: string
  error?: string | undefined
}

export const getCragDetailsNear = async (
  placeId: string = 'unspecified',
  lnglat: [number, number],
  range: number[],
  includeCrags: boolean = false
): Promise<CragsDetailsNearType> => {
  try {
    const rs = await graphqlClient.query({
      query: CRAGS_NEAR,
      fetchPolicy: 'cache-first',
      variables: {
        lng: lnglat[0],
        lat: lnglat[1],
        placeId,
        minDistance: range[0],
        maxDistance: range[1],
        includeCrags
      }
    })

    const { cragsNear } = rs.data
    const groups = cragsNear.map(entry => entry.crags).flat()
    return { data: groups, placeId }
  } catch (e) {
    console.log(e)
  }
  return {
    data: [],
    error: 'API error',
    placeId: undefined
  }
}

const CRAGS_NEAR = gql`query CragsNear($placeId: String, $lng: Float, $lat: Float, $minDistance: Int, $maxDistance: Int, $includeCrags: Boolean) {
  cragsNear(placeId: $placeId, lnglat: {lat: $lat, lng: $lng}, minDistance: $minDistance, maxDistance: $maxDistance, includeCrags: $includeCrags) {
      count
      _id 
      placeId
      crags {
        areaName
        id
        totalClimbs
        pathTokens
        metadata {
          lat
          lng
          areaID
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
  }
}`
