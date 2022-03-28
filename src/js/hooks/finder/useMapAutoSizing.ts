import { useEffect, useCallback, useState } from 'react'
import { InitialViewStateProps } from '@deck.gl/core/lib/deck'

import { bboxFromGeoJson, bbox2Viewport } from '../../../js/GeoHelpers'
import { DEFAULT_INITIAL_VIEWSTATE } from '../../../components/maps/BaseMap'
import { store } from '../../stores'
import { NAV_BAR_OFFSET } from '../../../components/header'

/**
 * React hook for auto detecting and calculating div height
 */
export default function useAutoSizing ({ geojson }): any {
  const [[width, height], setWH] = useState([400, 400])
  const [viewState, setViewState] = useState<InitialViewStateProps>(DEFAULT_INITIAL_VIEWSTATE)

  const isLoading = store.filters.isLoading()
  useEffect(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    if (geojson !== undefined && geojson.features.length > 0) {
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
    const { width, height } = getMapDivDimensions('my-area-map')
    setWH([width, height])
  }, [width, height])
  return [viewState, height, setViewState]
}

const getMapDivDimensions = (id: string): { width: number, height: number } => {
  const div = document.getElementById(id)
  let width = 200
  if (div != null) {
    width = div.clientWidth
  }
  const height = window.innerHeight - NAV_BAR_OFFSET
  return { width, height }
}
