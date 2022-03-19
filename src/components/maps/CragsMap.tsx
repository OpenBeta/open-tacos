import React, { useEffect, useState, useCallback } from 'react'
import { InitialViewStateProps } from '@deck.gl/core/lib/deck'
import { Source, Layer, LayerProps } from 'react-map-gl'
import { Position, Properties, FeatureCollection, Geometry } from '@turf/helpers'

import BaseMap, { DEFAULT_INITIAL_VIEWSTATE } from './BaseMap'
import { bboxFromGeoJson, bbox2Viewport } from '../../js/GeoHelpers'

const NAV_BAR_OFFSET = 66

const layerStyle: LayerProps = {
  id: 'area-labels',
  type: 'symbol',
  source: 'areas',
  layout: {
    'icon-size': ['interpolate', ['linear'], ['zoom'], 8, 1.25, 12, 1],
    'symbol-spacing': 5,
    'text-field': ['get', 'name'],
    'text-variable-anchor': ['bottom', 'left', 'right'],
    'text-radial-offset': 1,
    'text-justify': 'auto',
    'icon-image': 'circle',
    'text-size': ['interpolate', ['linear'], ['zoom'], 8, 14, 14, 12]
  },
  paint: {
    'text-halo-blur': 4,
    'text-halo-width': 2,
    'text-color': '#ffffff',
    'text-halo-color': '#334455'
  }
}

interface HeatmapProps {
  geojson?: FeatureCollection<Geometry, Properties>
  center: Position
  children?: JSX.Element
}

export default function CragsMap ({ geojson, center }: HeatmapProps): JSX.Element {
  const [[width, height], setWH] = useState([400, 400])
  const [viewstate, setViewState] = useState<InitialViewStateProps>(DEFAULT_INITIAL_VIEWSTATE)

  useEffect(() => {
    updateDimensions()

    window.addEventListener('resize', updateDimensions)
    if (geojson === undefined) return
    if (geojson.features.length > 0) {
      const bbox = bboxFromGeoJson(geojson)
      const vs = bbox2Viewport(bbox, width, height)
      setViewState({ ...viewstate, ...vs })
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

  return (
    <div
      id='my-area-heatmap'
      className='w-full xl:sticky xl:top-28 xl:m-0 xl:p-0'
      style={{ height }}
    >
      <BaseMap
        disableController={false}
        layers={[]}
        initialViewState={viewstate}
        viewstate={viewstate}
        onViewStateChange={onViewStateChange}
        light={false}
      >
        <Source
          id='areas'
          type='geojson'
          data={geojson as FeatureCollection<GeoJSON.Geometry, Properties>}
        >
          <Layer {...layerStyle} />
        </Source>
      </BaseMap>
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
