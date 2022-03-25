import { gql } from '@apollo/client'
import { AreaType } from '../types'
import { graphqlClient } from './Client'

interface CragsDetailsNearType {
  data: Array<Partial<AreaType>>
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
    return { data: groups }
  } catch (e) {
    console.log(e)
  }
  return {
    data: [],
    error: 'API error'
  }
}

const CRAGS_NEAR = gql`query CragsNear($placeId: String, $lng: Float, $lat: Float, $minDistance: Int, $maxDistance: Int, $includeCrags: Boolean) {
  cragsNear(placeId: $placeId, lnglat: {lat: $lat, lng: $lng}, minDistance: $minDistance, maxDistance: $maxDistance, includeCrags: $includeCrags) {
      count
      _id 
      placeId
      crags {
        area_name
        id
        totalClimbs
        metadata {
          lat
          lng
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

// const CRAGS_NEAR = gql`query CragsNear($placeId: String, $lng: Float, $lat: Float, $minDistance: Int, $maxDistance: Int) {
//   cragsNear(placeId: $placeId, lnglat: {lat: $lat, lng: $lng}, minDistance: $minDistance, maxDistance: $maxDistance) {
//       count
//       _id
//       placeId
//       crags {
//         area_name
//         id
//         totalClimbs
//         metadata {
//           lat
//           lng
//         }
//         climbs {
//           type {
//             aid
//             alpine
//             bouldering
//             mixed
//             sport
//             tr
//             trad
//           }
//         }
//         aggregate {
//           byDiscipline {
//             sport {
//               total
//               bands {
//                 advance
//                 beginner
//                 expert
//                 intermediate
//               }
//             }
//             trad {
//               total
//               bands {
//                 advance
//                 beginner
//                 expert
//                 intermediate
//               }
//             }
//             boulder {
//               total
//               bands {
//                 advance
//                 beginner
//                 expert
//                 intermediate
//               }
//             }
//             tr {
//               total
//               bands {
//                 advance
//                 beginner
//                 expert
//                 intermediate
//               }
//             }
//           }
//           byGradeBand {
//             advance
//             beginner
//             expert
//             intermediate
//           }
//         }
//       }
//   }
// }`
