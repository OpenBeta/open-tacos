import { useEffect, useCallback, useState, Dispatch, SetStateAction } from 'react'

import { bboxFromGeoJson, bbox2Viewport } from '../../../js/GeoHelpers'
import { DEFAULT_INITIAL_VIEWSTATE } from '../../../components/maps/BaseMap'
import { store } from '../../stores'
import { getNavBarOffset } from '../../../components/Header'

import { XViewStateType } from '../../../js/types'
/** The return type for our responsive window logic. */
type useAutoSizingReturn = readonly [
  XViewStateType,
  number,
  Dispatch<SetStateAction<XViewStateType>>,
]

/**
 * React hook for auto detecting and calculating div height
 */
export default function useAutoSizing ({ geojson, elementId }): useAutoSizingReturn {
  const navbarOffset = getNavBarOffset()
  const [[width, height], setWH] = useState([DEFAULT_INITIAL_VIEWSTATE.width, DEFAULT_INITIAL_VIEWSTATE.height])
  const [viewState, setViewState] = useState<XViewStateType>(DEFAULT_INITIAL_VIEWSTATE)

  const isLoading = store.filters.isLoading()
  useEffect(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    if (geojson != null && geojson.features.length > 0) {
      // Calculate new viewState based on crag search result
      const bbox = bboxFromGeoJson(geojson)
      const vs = bbox2Viewport(bbox, width, height)
      setViewState({ ...viewState, ...vs, ...bbox })
    } else {
      setViewState(previous => ({ ...previous, width, height }))
    }
    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [geojson, isLoading, width, height])

  const updateDimensions = useCallback(() => {
    const { width, height } = getMapDivDimensions(elementId, navbarOffset)
    setWH([width, height])
  }, [width, height])

  return [viewState, height, setViewState] as const
}

const getMapDivDimensions = (id: string, offset: number): { width: number, height: number } => {
  const div = document.getElementById(id)
  let width = 200
  if (div != null) {
    width = div.clientWidth
  }
  const height = window.innerHeight - offset
  return { width, height }
}
