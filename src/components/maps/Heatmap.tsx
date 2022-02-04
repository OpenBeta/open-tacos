import React, { useEffect, useState, useCallback } from 'react'
import { HeatmapLayer } from '@deck.gl/aggregation-layers'
import { GeoJsonLayer } from '@deck.gl/layers'
import { InitialViewStateProps, ColorRange } from '@deck.gl/core'

import usaHeatMapData from '../../assets/usa-heatmap.json'
import BaseMap, { DEFAULT_INITIAL_VIEWSTATE } from './BaseMap'
import { bboxFromGeoJson, bbox2Viewport } from '../../js/GeoHelpers'
import { GeojsonFeatureType } from '../../js/types'

const COLOR_RANGE: ColorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
]

const NAV_BAR_OFFSET = 66

interface HeatmapProps {
  geojson?: GeojsonFeatureType
  children?: JSX.Element
  getTooltip: (obj: unknown) => void
}

export default function Heatmap ({ geojson }: HeatmapProps): JSX.Element {
  const [[width, height], setWH] = useState([400, 400])
  const [viewstate, setViewState] = useState<InitialViewStateProps>(DEFAULT_INITIAL_VIEWSTATE)

  useEffect(() => {
    if (geojson == null) return

    updateDimensions()

    window.addEventListener('resize', updateDimensions)
    const bbox = bboxFromGeoJson(geojson)
    const vs = bbox2Viewport(bbox, width, height)

    if (geojson.geometry !== undefined && geojson.geometry.type.toUpperCase() === 'POINT') {
      setViewState({ ...vs, zoom: 10 })
    } else {
      setViewState(vs)
    }
    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [geojson])

  const onViewStateChange = useCallback(({ viewState }) => {
    setViewState(viewState)
  }, [])

  const updateDimensions = useCallback(() => {
    const { width, height } = getMapDivDimensions('my-area-map')
    setWH([width, height])
  }, [width, height])

  const layers = [
    new GeoJsonLayer({
      id: 'geojson-layer',
      data: (geojson != null) || [],
      pickable: false,
      stroked: true,
      filled: viewstate.zoom < 8,
      extruded: false,
      pointType: 'circle',
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getFillColor: [251, 113, 133, 50],
      opacity: viewstate.zoom < 6 ? 1 : 0.2,
      getLineColor: [253, 164, 175],
      getPointRadius: 100,
      getLineWidth: 4,
      getElevation: 0
    }),
    new HeatmapLayer({
      data: usaHeatMapData,
      id: 'heatmp-layer',
      pickable: false,
      getPosition: (d) => [d.lon, d.lat, 10],
      getWeight: () => 1,
      radiusPixels: 20,
      intensity: 1,
      threshold: 0.03,
      opacity: 0.65,
      colorRange: COLOR_RANGE
    })
  ]
  return (
    <div
      id='my-area-map'
      className='w-full xl:sticky xl:top-16 z-9 xl:m-0 xl:p-0'
      style={{ height }}
    >
      <BaseMap
        layers={layers}
        initialViewState={viewstate}
        viewstate={viewstate}
        onViewStateChange={onViewStateChange}
      />
    </div>
  )
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
