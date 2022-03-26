import { mapValuesKey, createStore } from '@udecode/zustood'

import { RadiusRange } from '../types'
import { getCragDetailsNear } from '../graphql/api'
import { calculatePagination } from './util'
import { applyFilters } from '../../components/finder/CragTable'

/**
 * App main data store
 */

export const ITEMS_PER_PAGE = 20

export const cragFiltersStore = createStore('filters')({
  placeId: '',
  searchText: '',
  crags: [],
  total: 0,
  lnglat: undefined,
  isLoading: false,
  trad: true,
  sport: true,
  boulder: true,
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
  applyLocalFilters: () => {
    const newCragsState = get.crags().filter(crag => applyFilters(crag, get))
    set.crags(newCragsState)
    set.total(newCragsState.length)
    set.updatePagination(true)
  }
}))
  .extendActions((set, get, api) => ({
  // - Update main data structure (crags)
  // - Calculate derived data
    fetchData: async () => {
      const { placeId, lnglat, radius } = get
      set.isLoading(true)
      const { data } = await getCragDetailsNear(
        placeId(), lnglat(), radius().rangeMeters, true)
      const newCragsState = data.filter(crag => applyFilters(crag, get))

      set.isLoading(false)
      set.crags(newCragsState)
      set.total(newCragsState.length)
      set.updatePagination(true)
    }
  }))
  .extendActions((set, get, api) => ({
    updateRadius: async (range: RadiusRange) => {
      set.radius(range)
      await set.fetchData()
    },

    validLnglat: async (text: string, placeId: string, lnglat: [number, number]) => {
      set.lnglat(lnglat)
      set.placeId(placeId)
      set.searchText(text)
      await set.fetchData()
    },

    /*
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
    },

    updateFreeRange: async (newRange) => {
      set.freeRange(newRange)
      await set.fetchData()
    },

    toggle: async (stateName: 'sport'| 'trad' | 'tr' | 'boulder') => {
      let previousState = true
      set.state(draft => {
        /* eslint-disable-next-line */
        previousState = draft[stateName] as boolean
        draft[stateName] = !previousState
      })
      await set.fetchData()
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
