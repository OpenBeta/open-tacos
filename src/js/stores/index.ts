import { mapValuesKey, createStore } from '@udecode/zustood'

import { RadiusRange } from '../types'
import { getCragDetailsNear } from '../graphql/api'

/**
 * App main data store
 */
export const cragFiltersStore = createStore('filters')({
  trad: true,
  sport: true,
  bouldering: true,
  tr: true,
  freeRange: {
    scores: [0, 0],
    labels: ['5.6', '5.10']
  },
  boulderingRange: {
    scores: [0, 0],
    labels: ['v0', 'v3']
  },
  radius: {
    rangeMeters: [0, 48000],
    rangeIndices: [0, 1]
  }
}, {
  // Todo: figure out how to persist/restore settings from Local storage
  // persist: {
  //   name: 'ob-filters',
  //   enabled: true,
  //   onRehydrateStorage: () => (state) => {
  //     console.log('hydration starts', state)
  //   }
  // }
}).extendActions((set, get, api) => ({
  toggle: (stateName: 'sport'| 'trad' | 'tr' | 'bouldering') => {
    set.state(draft => {
      /* eslint-disable-next-line */
      draft[stateName] = !(draft[stateName] as boolean)
    })
  },

  updateRadius: async (range: RadiusRange) => {
    set.radius(range)
    const { groups, total } = await getCragDetailsNear(
      undefined,
      cragFinderStore.get.lnglat(),
      get.radius().rangeMeters, true)
    actions.finder.updateData(groups, total)
  }
}))

/**
 * Crag finder data
 */
export const cragFinderStore = createStore('finder')({
  searchText: '',
  groups: [],
  total: 0,
  lnglat: undefined,
  isLoading: false
}).extendActions((set, get, api) => ({
  updateData: (groups, total) => {
    set.groups(groups)
    set.total(total)
  },
  validLnglat: async (text: string, placeId: string, lnglat: [number, number]) => {
    set.lnglat(lnglat)
    set.searchText(text)
    set.groups([])
    set.isLoading(true)
    const { groups, total } = await getCragDetailsNear(placeId, lnglat, cragFiltersStore.get.radius().rangeMeters, true)
    set.groups(groups)
    set.total(total)
    set.isLoading(false)
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
