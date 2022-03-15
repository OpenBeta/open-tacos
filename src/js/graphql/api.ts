import { gql } from '@apollo/client'
import { graphqlClient } from './Client'

export const getCragsNear = async (lnglat: [number, number]): Promise<any> => {
  const query = gql`query CragsNear($lng: Float, $lat: Float, $maxDistance: Int) {
        cragsNear(lnglat: {lat: $lat, lng: $lng}, maxDistance: $maxDistance) {
            crags {
                area_name
            }
            count
            _id
        }
    }`
  const rs = await graphqlClient.query<any>({
    query,
    variables: {
      lng: lnglat[0],
      lat: lnglat[1],
      maxDistance: 200000
    }
  })
  return rs.data
}
