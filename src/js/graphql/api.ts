import { gql } from '@apollo/client'
import { graphqlClient } from './Client'

export const getCragDetailsNear = async (
  placeId: string = 'unspecified',
  lnglat: [number, number],
  range: number[],
  includeCrags: boolean = false
): Promise<any> => {
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

    const total = cragsNear.reduce((acc: number, curr) => {
      return acc + (curr.count as number)
    }, 0)
    return {
      groups: cragsNear,
      total: total
    }
  } catch (e) {
    console.log(e)
  }
  return {
    groups: {},
    total: 0
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
