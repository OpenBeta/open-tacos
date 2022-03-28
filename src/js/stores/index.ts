import { mapValuesKey, createStore } from '@udecode/zustood'
import produce from 'immer'

import { RadiusRange, CountByGradeBandType, AreaType } from '../types'
import { getCragDetailsNear } from '../graphql/api'
import { calculatePagination, NextPaginationProps } from './util'
import { YDS_DEFS } from '../grades/rangeDefs'
import { freeScoreToBandIndex, BAND_BY_INDEX } from '../grades/bandUtil'

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
  freeRange: [4, 8], // keys to YDS_DEFS object
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
  },
  map: {
    hover: {
      areaId: null,
      lnglat: null
    },
    active: {
      areaId: null,
      lnglat: null
    }
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
}).extendSelectors((_, get) => ({

  displayFreeRange: () => {
    const [min, max] = get.freeRange()
    return ([
      YDS_DEFS[min].label,
      YDS_DEFS[max].label])
  },

  scoreFreeRange: () => {
    const [min, max] = get.freeRange()
    return ([
      YDS_DEFS[min].score,
      YDS_DEFS[max].score])
  }
}))
  .extendSelectors((_, get) => ({

    bandRange: () => {
      const [min, max] = get.scoreFreeRange()
      const minBand = freeScoreToBandIndex(min)
      const maxBand = freeScoreToBandIndex(max)
      return [
        minBand,
        maxBand]
    }
  })).extendSelectors((_, get) => ({

    withinFreeRange: (gradeBands: CountByGradeBandType | undefined) => {
      if (gradeBands === undefined) return false

      const [min, max] = get.bandRange()

      for (let i: number = min; i <= max; i++) {
        if (gradeBands[BAND_BY_INDEX[i]] > 0) {
          return true
        }
      }
      return false
    },

    /**
   * Test if crag's gradeBands match user's preferences
   * @param gradeBands user bouldering range
   * @returns
   */
    withinBoulderRange: (gradeBands: CountByGradeBandType | undefined) => {
    // TBD
      return true
    }
  })).extendSelectors((_, get) => ({

    inMyRange: (crag: Partial<AreaType>): boolean => {
      const { byDiscipline } = crag.aggregate

      const { trad, sport, boulder, tr } = get

      if (trad() && (byDiscipline?.trad?.total > 0 ?? false) &&
      get.withinFreeRange(byDiscipline?.trad?.bands)) return true

      if (sport() && (byDiscipline?.sport?.total > 0 ?? false) &&
      get.withinFreeRange(byDiscipline?.sport?.bands)) return true

      if (boulder() && (byDiscipline?.boulder?.total > 0 ?? false) &&
        get.withinBoulderRange(byDiscipline?.boulder?.bands)) return true

      if (tr() && (byDiscipline?.tr?.total > 0 ?? false) &&
      get.withinFreeRange(byDiscipline?.tr?.bands)) return true

      return false
    }
  }))
  .extendSelectors((_, get) => ({
    areaById: (searchId: string): AreaType | undefined => {
      return get.crags().find(({ id }) => id === searchId)
    }
  }))
  .extendActions((set, get, api) => ({
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
  }))
  .extendActions((set, get, api) => ({
    setActiveMarker: (areaId: string, lnglat: number[]) => {
      const nextState = produce(get.map(), draft => {
        draft.active = {
          areaId,
          lnglat
        }
      })
      set.map(nextState)
    },
    deactivateActiveMarker: () => {
      const nextState = produce(get.map(), draft => {
        draft.active = {
          areaId: null,
          lnglat: null
        }
      })
      set.map(nextState)
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
      const newCragsState = data.filter(crag => get.inMyRange(crag))
      set.isLoading(false)
      set.deactivateActiveMarker()
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

export type { NextPaginationProps }
