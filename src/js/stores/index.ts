import { mapValuesKey, createStore } from '@udecode/zustood'
import {
  gql
} from '@apollo/client'
import { graphqlClient } from '../../js/graphql/Client'

/**
 * Crag finder filters
 */
export const cragFiltersStore = createStore('filters')({
  name: 'zustood',
  stars: 0
})

/**
 * Crag finder data
 */
export const cragFinderStore = createStore('finder')({
  searchText: '',
  crags: [],
  total: 0,
  lnglat: [-90, -180]
}).extendActions((set, get, api) => ({
  validLnglat: async (text: string, lnglat: [number, number]) => {
    set.lnglat(lnglat)
    set.searchText(text)
    const rs = await graphqlClient.query({
      query: CRAGS_NEAR,
      fetchPolicy: 'network-only',
      variables: {
        lng: lnglat[0],
        lat: lnglat[1],
        maxDistance: 200000
      }
    })
    // console.log(rs.data)

    const { cragsNear } = rs.data

    set.crags(cragsNear)

    const total = cragsNear.reduce((acc: number, curr) => {
      return acc + (curr.count as number)
    }, 0)

    set.total(total)
  }
}))

// Global store
export const rootStore = {
  finder: cragFinderStore,
  filters: cragFiltersStore
}

// Global hook selectors
export const useStore = () => mapValuesKey('use', rootStore)

// Global getter selectors
export const store = mapValuesKey('get', rootStore)

// Global actions
export const actions = mapValuesKey('set', rootStore)

const CRAGS_NEAR = gql`query CragsNear($lng: Float, $lat: Float, $maxDistance: Int) {
  cragsNear(lnglat: {lat: $lat, lng: $lng}, maxDistance: $maxDistance) {
      count
      _id 
      crags {
          aggregate {
              byGrade {
                  count
                  label
              }
          }
          area_name
      }
  }
}`
