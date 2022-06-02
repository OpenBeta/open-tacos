import { useEffect, useCallback, useState, Dispatch, SetStateAction } from 'react'

import { bboxFromGeoJson, bbox2Viewport } from '../../../js/GeoHelpers'
import { DEFAULT_INITIAL_VIEWSTATE } from '../../../components/maps/BaseMap'
import { store } from '../../stores'
import { getNavBarOffset } from '../../../components/Header'
import { ViewState } from 'react-map-gl'

/** The return type for our responsive window logic. */
type useAutoSizingReturn = readonly [
  ViewState,
  number,
  Dispatch<SetStateAction<ViewState>>,
]

/**
 * React hook for auto detecting and calculating div height
 */
export default function useAutoSizing ({ geojson }): useAutoSizingReturn {
  const navbarOffset = getNavBarOffset()
  const [[width, height], setWH] = useState([300, 400])
  const [viewState, setViewState] = useState<ViewState>(DEFAULT_INITIAL_VIEWSTATE)

  const isLoading = store.filters.isLoading()
  useEffect(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    if (geojson != null && geojson.features.length > 0) {
      // Calculate new viewState based on crag search result
      const bbox = bboxFromGeoJson(geojson)
      const vs = bbox2Viewport(bbox, width, height)
      setViewState({ ...viewState, ...vs })
    }
    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [geojson, isLoading])

  const updateDimensions = useCallback(() => {
    const { width, height } = getMapDivDimensions('my-area-map', navbarOffset)
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
