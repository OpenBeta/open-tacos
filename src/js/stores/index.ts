import { mapValuesKey, createStore } from '@udecode/zustood'

import { RadiusRange } from '../types'
import { getCragDetailsNear } from '../graphql/api'
import { calculatePagination } from './util'
/**
 * App main data store
 */

const ITEMS_PER_PAGE = 20

export const cragFiltersStore = createStore('filters')({
  searchText: '',
  crags: [],
  total: 0,
  lnglat: undefined,
  isLoading: false,
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
  },
  pagination: {
    currentItems: [],
    pageCount: 0,
    itemOffset: 0,
    currentPage: 0
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
  }
})).extendActions((set, get, api) => ({
  updatePagination: (shouldResetToPage0: boolean = false) => {
    const itemOffset = shouldResetToPage0 ? 0 : get.pagination().itemOffset
    const newState = calculatePagination(
      {
        whole: get.crags(),
        itemOffset,
        itemsPerPage: ITEMS_PER_PAGE
      })
    set.pagination(newState)
  }
})).extendActions((set, get, api) => ({
  // - Update main data structure (crags)
  // - Calculate derived data
  update: (crags) => {
    set.crags(crags)
    set.total(crags.length)
    set.updatePagination(true)
  }
}))
  .extendActions((set, get, api) => ({
    updateRadius: async (range: RadiusRange) => {
      set.radius(range)
      set.isLoading(true)
      const { data } = await getCragDetailsNear(
        undefined,
        get.lnglat(),
        get.radius().rangeMeters, true)
      set.isLoading(false)
      set.update(data)
    },

    validLnglat: async (text: string, placeId: string, lnglat: [number, number]) => {
      set.lnglat(lnglat)
      set.searchText(text)
      set.isLoading(true)
      const { data } = await getCragDetailsNear(
        placeId, lnglat, get.radius().rangeMeters, true)
      set.update(data)
      set.isLoading(false)
    },

    /**
   * Jump to new page
   * @param pageNumber
   */
    toPage: (pageNumber: number) => {
      const newOffset = (pageNumber * ITEMS_PER_PAGE) % get.crags().length
      set.pagination({
        ...get.pagination(),
        itemOffset: newOffset
      })

      set.updatePagination()
    }
  }))

// Global store
export const rootStore = {
  // finder: cragFinderStore,
  filters: cragFiltersStore
}

// Global hook selectors
/* eslint-disable-next-line */
export const useStore = () => mapValuesKey('use', rootStore)

// Global getter selectors
export const store = mapValuesKey('get', rootStore)

// Global actions
export const actions = mapValuesKey('set', rootStore)
