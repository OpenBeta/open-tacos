import { point, Feature, Point } from '@turf/helpers'

import { AreaType } from '../types'
import { sanitizeName } from '../utils'

interface CalculatePaginationProps {
  itemOffset: number
  itemsPerPage: number
  whole: AreaType[]
}

export interface NextPaginationProps {
  currentItems: AreaType[]
  pageCount: number
  itemOffset: number
  currentPage: number
}

export const calculatePagination = (
  { itemOffset, itemsPerPage, whole }: CalculatePaginationProps): NextPaginationProps => {
  const endOffset = itemOffset + itemsPerPage
  const currentItems = whole.slice(itemOffset, endOffset)
  const pageCount = Math.ceil(whole.length / itemsPerPage)
  const currentPage = Math.round(itemOffset / itemsPerPage)
  return {
    currentItems,
    pageCount,
    itemOffset,
    currentPage
  }
}

export const geojsonifyCrag = (crag: AreaType, isInMyRange: boolean): Feature<Point> => {
  const { areaName, metadata, totalClimbs, density } = crag
  const { areaId } = metadata
  const props = {
    id: areaId,
    name: sanitizeName(areaName),
    lng: metadata.lng,
    lat: metadata.lat,
    totalClimbs,
    density,
    isInMyRange,
    leaf: metadata.leaf
  }
  return point([metadata.lng, metadata.lat], props, { id: areaId })
}
