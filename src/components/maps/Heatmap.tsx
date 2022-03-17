import React, { useEffect, useState, useCallback } from 'react'
import { HeatmapLayer } from '@deck.gl/aggregation-layers'
import { Position2D } from 'deck.gl'
import { multiPoint, Position } from '@turf/helpers'

import BaseMap, { DEFAULT_INITIAL_VIEWSTATE } from './BaseMap'
import { bboxFromGeoJson, bbox2Viewport } from '../../js/GeoHelpers'
import { InitialViewStateProps } from '@deck.gl/core/lib/deck'
import { ColorRange } from '@deck.gl/core/utils/color'

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
  geojson?: Position[]
  center: Position
  children?: JSX.Element
}

export default function Heatmap ({ geojson, center }: HeatmapProps): JSX.Element {
  const [[width, height], setWH] = useState([400, 400])
  const [viewstate, setViewState] = useState<InitialViewStateProps>(DEFAULT_INITIAL_VIEWSTATE)

  const [ready, setReady] = useState(false)
  useEffect(() => {
    updateDimensions()

    window.addEventListener('resize', updateDimensions)
    if (geojson.length > 0) {
      const bbox = bboxFromGeoJson(multiPoint(geojson))
      const vs = bbox2Viewport(bbox, width, height)
      setViewState({ ...viewstate, ...vs })
      setReady(true)
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
    new HeatmapLayer({
      data: geojson ?? [],
      id: 'heatmp-layer',
      getWeight: () => 1,
      getPosition: (d: Position2D) => d,
      radiusPixels: 20,
      intensity: 1,
      threshold: 0.03,
      opacity: 0.65,
      colorRange: COLOR_RANGE,
      visible: ready
    })
  ]

  return (
    <div
      id='my-area-heatmap'
      className='w-full xl:sticky xl:top-28 xl:m-0 xl:p-0'
      style={{ height }}
    >
      <BaseMap
        disableController={false}
        layers={layers}
        initialViewState={viewstate}
        viewstate={viewstate}
        onViewStateChange={onViewStateChange}
        light={false}
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
