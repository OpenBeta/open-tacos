import { mapValuesKey, createStore } from '@udecode/zustood'
import {
  gql
} from '@apollo/client'
import { graphqlClient } from '../../js/graphql/Client'

/**
 * Crag finder filters
 */
export const cragFiltersStore = createStore('filters')({
  trad: true,
  sport: true,
  bouldering: true,
  tr: true
}).extendActions((set, get, api) => ({
  toggle: (stateName: 'sport'| 'trad' | 'tr' | 'bouldering') => {
    set.state(draft => {
      /* eslint-disable-next-line */
      draft[stateName] = !(draft[stateName] as boolean)
    })
  }
}))

/**
 * Crag finder data
 */
export const cragFinderStore = createStore('finder')({
  searchText: '',
  groups: [],
  total: 0,
  lnglat: [-90, -180],
  isLoading: false
}).extendActions((set, get, api) => ({
  validLnglat: async (text: string, placeId: string, lnglat: [number, number]) => {
    set.lnglat(lnglat)
    set.searchText(text)
    set.isLoading(true)
    set.groups([])
    try {
      const rs = await graphqlClient.query({
        query: CRAGS_NEAR,
        fetchPolicy: 'cache-first',
        variables: {
          lng: lnglat[0],
          lat: lnglat[1],
          placeId,
          maxDistance: 120000
        }
      })

      const { cragsNear } = rs.data

      set.groups(cragsNear)

      const total = cragsNear.reduce((acc: number, curr) => {
        return acc + (curr.count as number)
      }, 0)

      set.total(total)
    } catch (e) {
      console.log(e)
    } finally {
      set.isLoading(false)
    }
  }
}))

// Global store
export const rootStore = {
  finder: cragFinderStore,
  filters: cragFiltersStore
}

// Global hook selectors
/* eslint-disable-next-line */
export const useStore = () => mapValuesKey('use', rootStore)

// Global getter selectors
export const store = mapValuesKey('get', rootStore)

// Global actions
export const actions = mapValuesKey('set', rootStore)

const CRAGS_NEAR = gql`query CragsNear($placeId: String, $lng: Float, $lat: Float, $maxDistance: Int) {
  cragsNear(placeId: $placeId, lnglat: {lat: $lat, lng: $lng}, maxDistance: $maxDistance) {
      count
      _id 
      placeId
      crags {
          area_name
          id
          totalClimbs
          climbs {
            type {
              aid
              alpine
              bouldering
              mixed
              sport
              tr
              trad
            }
        }
      }
  }
}`
