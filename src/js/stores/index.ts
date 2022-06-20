import { mapValuesKey, createStore } from '@udecode/zustood'
import produce from 'immer'
import { featureCollection, Feature, Point } from '@turf/helpers'

import { RadiusRange, CountByGradeBandType, AreaType, ClimbDisciplineRecord, AggregateType } from '../types'
import { getCragDetailsNear, getAreaByUUID } from '../graphql/api'
import { calculatePagination, NextPaginationProps, geojsonifyCrag } from './util'
import { BOULDER_DEFS, YDS_DEFS } from '../grades/rangeDefs'
import { vScoreToBandIndex, freeScoreToBandIndex, BAND_BY_INDEX } from '../grades/bandUtil'
import { userMediaStore } from './media'
/**
 * App main data store
 */

export const ITEMS_PER_PAGE = 20

export interface IAppState {
  placeId: string
  searchText: string
  crags: AreaType[] // crags with filters applied
  allGeoJson: any// all crags in Geojson without filtering
  total: number
  lnglat: number[]
  isLoading: boolean
  trad: boolean
  sport: boolean
  boulder: boolean
  tr: boolean
  freeRange: number[] // keys to YDS_DEFS object'
  boulderRange: number[] // keys to YDS_BOULDER object
  boulderingRange: {
    scores: number[]
    labels: string[]
  }
  radius: {
    rangeMeters: number[]
    rangeIndices: number[]
  }
  pagination: NextPaginationProps
  map: {
    hover: {
      areaId: string | null
      lnglat: number[] | null
    }
    active: {
      areaId: string | null
      lnglat: number[] | null
    }
  }
}

const INITIAL_STATE: IAppState = {
  placeId: '',
  searchText: '',
  crags: [], // crags with filters applied
  allGeoJson: undefined, // all crags in Geojson without filtering
  total: 0,
  lnglat: [0, 0],
  isLoading: false,
  trad: true,
  sport: true,
  boulder: true,
  tr: true,
  freeRange: [4, 8], // keys to YDS_DEFS object'
  boulderRange: [0, 4], // keys to YDS_BOULDER object
  boulderingRange: {
    scores: [0, 0],
    labels: ['V-easy', 'V3']
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
      lnglat: [0, 0]
    },
    active: {
      areaId: null,
      lnglat: [0, 0]
    }
  }
}
export const cragFiltersStore = createStore('filters')(INITIAL_STATE, {
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

  displayBoulderRange: () => {
    const [min, max] = get.boulderRange()
    return ([
      BOULDER_DEFS[min].label,
      BOULDER_DEFS[max].label])
  },

  scoreFreeRange: () => {
    const [min, max] = get.freeRange()
    return ([
      YDS_DEFS[min].score,
      YDS_DEFS[max].score])
  },

  scoreBoulderRange: () => {
    const [min, max] = get.boulderRange()
    return ([
      BOULDER_DEFS[min].score,
      BOULDER_DEFS[max].score])
  }

}))
  .extendSelectors((_, get) => ({

    freeBandRange: () => {
      const [min, max] = get.scoreFreeRange()
      const minBand = freeScoreToBandIndex(min)
      const maxBand = freeScoreToBandIndex(max)
      return [
        minBand,
        maxBand]
    },
    boulderBandRange: () => {
      const [min, max] = get.scoreBoulderRange()
      const minBand = vScoreToBandIndex(min)
      const maxBand = vScoreToBandIndex(max)
      return [
        minBand,
        maxBand]
    }
  })).extendSelectors((_, get) => ({

    withinSportRangeCount: (gradeBands: CountByGradeBandType | undefined): number => {
      let total: number = 0
      if (gradeBands === undefined) return total

      const [min, max] = get.freeBandRange()

      for (let i: number = min; i <= max; i++) {
        if (gradeBands[BAND_BY_INDEX[i]] > 0) {
          total += parseInt(gradeBands[BAND_BY_INDEX[i]])
        }
      }
      return total
    },

    withinTradRangeCount: (gradeBands: CountByGradeBandType | undefined) => {
      let total: number = 0
      if (gradeBands === undefined) return total

      const [min, max] = get.freeBandRange()

      for (let i: number = min; i <= max; i++) {
        if (gradeBands[BAND_BY_INDEX[i]] > 0) {
          total += parseInt(gradeBands[BAND_BY_INDEX[i]])
        }
      }
      return total
    },

    withinBoulderRangeCount: (gradeBands: CountByGradeBandType | undefined) => {
      let total: number = 0
      if (gradeBands === undefined) return total

      const [min, max] = get.boulderBandRange()

      for (let i: number = min; i <= max; i++) {
        if (gradeBands[BAND_BY_INDEX[i]] > 0) {
          total += parseInt(gradeBands[BAND_BY_INDEX[i]])
        }
      }
      return total
    },

    withinTrRangeCount: (gradeBands: CountByGradeBandType | undefined) => {
      let total: number = 0
      if (gradeBands === undefined) return total

      const [min, max] = get.freeBandRange()

      for (let i: number = min; i <= max; i++) {
        if (gradeBands[BAND_BY_INDEX[i]] > 0) {
          total += parseInt(gradeBands[BAND_BY_INDEX[i]])
        }
      }
      return total
    },

    withinFreeRange: (gradeBands: CountByGradeBandType | undefined) => {
      if (gradeBands === undefined) return false

      const [min, max] = get.freeBandRange()

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
      if (gradeBands === undefined) return false

      const [min, max] = get.boulderBandRange()

      for (let i: number = min; i <= max; i++) {
        if (gradeBands[BAND_BY_INDEX[i]] > 0) {
          return true
        }
      }
      return false
    }
  })).extendSelectors((_, get) => ({

    inMyRange: (crag: AreaType): boolean => {
      const { byDiscipline } = crag.aggregate

      const { trad, sport, boulder, tr } = get

      if (trad() && ((byDiscipline?.trad?.total ?? 0) > 0 ?? false) &&
      get.withinFreeRange(byDiscipline?.trad?.bands)) return true

      if (sport() && ((byDiscipline?.sport?.total ?? 0) > 0 ?? false) &&
      get.withinFreeRange(byDiscipline?.sport?.bands)) return true

      if (boulder() && ((byDiscipline?.boulder?.total ?? 0) > 0 ?? false) &&
        get.withinBoulderRange(byDiscipline?.boulder?.bands)) return true

      if (tr() && ((byDiscipline?.tr?.total ?? 0) > 0 ?? false) &&
      get.withinFreeRange(byDiscipline?.tr?.bands)) return true

      return false
    }
  })).extendSelectors((_, get) => ({

    inMyRangeCount: (aggregate: AggregateType): number => {
      const { byDiscipline } = aggregate
      let total = 0
      const { trad, sport, boulder, tr } = get

      if (trad() && ((byDiscipline?.trad?.total ?? 0) > 0 ?? false) &&
      get.withinFreeRange(byDiscipline?.trad?.bands)) {
        total += get.withinTradRangeCount(byDiscipline?.trad?.bands)
      }

      if (sport() && ((byDiscipline?.sport?.total ?? 0) > 0 ?? false) &&
      get.withinFreeRange(byDiscipline?.sport?.bands)) {
        total += get.withinSportRangeCount(byDiscipline?.sport?.bands)
      }

      if (boulder() && ((byDiscipline?.boulder?.total ?? 0) > 0 ?? false) &&
        get.withinBoulderRange(byDiscipline?.boulder?.bands)) {
        total += get.withinBoulderRangeCount(byDiscipline?.boulder?.bands)
      }

      if (tr() && ((byDiscipline?.tr?.total ?? 0) > 0 ?? false) &&
      get.withinFreeRange(byDiscipline?.tr?.bands)) {
        total += get.withinTrRangeCount(byDiscipline?.tr?.bands)
      }

      return total
    }
  }))
  .extendSelectors((_, get) => ({
    areaById: (searchId: string): AreaType | null => {
      return getAreaByUUID(searchId)
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
      if (lnglat() === undefined) {
        return await Promise.resolve()
      }
      set.isLoading(true)
      const { data } = await getCragDetailsNear(
        placeId(), lnglat(), radius().rangeMeters, true)

      const allCragsGeoJson: Array<Feature<Point>> = []

      // Use Array.reduce() to apply filter
      const filteredCrags = data.reduce<AreaType[]>((acc, currentCrag) => {
        const isMyCrag = get.inMyRange(currentCrag)
        if (isMyCrag) {
          acc.push(currentCrag)
        }
        // we want to store all crags in geojson for heatmaps
        allCragsGeoJson.push(geojsonifyCrag(currentCrag, isMyCrag))
        return acc
      }, [])

      set.isLoading(false)
      set.deactivateActiveMarker()
      set.allGeoJson(featureCollection(allCragsGeoJson))
      set.crags(filteredCrags)
      set.total(filteredCrags.length)
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

    updateBoulderRange: async (newRange) => {
      set.boulderRange(newRange)
      await set.fetchData()
    },

    updateClimbTypes: async (climbTypes: Partial<ClimbDisciplineRecord>): Promise<void> => {
      const { sport, trad, tr, bouldering } = climbTypes
      // Update multiple states at once
      api.set.state(draft => {
        draft.sport = sport ?? false
        draft.trad = trad ?? false
        draft.tr = tr ?? false
        draft.boulder = bouldering ?? false
      })
      await set.fetchData()
    }
  }))

// Global store
export const rootStore = {
  // finder: cragFinderStore,
  filters: cragFiltersStore,
  media: userMediaStore
}

// Global hook selectors
/* eslint-disable-next-line */
export const useStore = () => mapValuesKey('use', rootStore)

// Global getter selectors
export const store = mapValuesKey('get', rootStore)

// Global actions
export const actions = mapValuesKey('set', rootStore)

export type { NextPaginationProps }
