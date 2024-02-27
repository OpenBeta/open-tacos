'use client'
import { Source, Layer, LineLayer, MapInstance } from 'react-map-gl'
import dynamic from 'next/dynamic'
import { lineString, Point, Polygon } from '@turf/helpers'
import lineToPolygon from '@turf/line-to-polygon'
import 'maplibre-gl/dist/maplibre-gl.css'

import { AreaMetadataType, AreaType } from '../../js/types'
import { GlobalMap } from './GlobalMap'

type ChildArea = Pick<AreaType, 'uuid' | 'areaName'> & { metadata: Pick<AreaMetadataType, 'lat' | 'lng' | 'leaf' | 'bbox' | 'polygon'> }
interface AreaMapProps {
  subAreas: ChildArea[]
  area: AreaType
  focused: string | null
  selected: string | null
}

export interface MapAreaFeatureProperties {
  id: string
  name: string
  content: {
    description: string
  }
  parent: string // due to a backend backend bug, this is a string instead of a parent object
  // parent: {
  //   id: string
  //   name: string
  // }
}

export interface HoverInfo {
  geometry: Point | Polygon
  data: MapAreaFeatureProperties
  mapInstance: MapInstance
}

/**
 * Area map
 */
const AreaMap: React.FC<AreaMapProps> = ({ area, subAreas }) => {
  let fitBoundOpts: any = { padding: { top: 45, left: 45, bottom: 45, right: 45 } }
  if (subAreas.length === 0) {
    fitBoundOpts = { maxZoom: 14 }
  }

  const { metadata } = area
  const boundary = metadata?.polygon == null ? null : lineToPolygon(lineString(metadata.polygon), { properties: { name: area.areaName } })
  return (
    <div className='relative w-full h-full'>
      <GlobalMap
        showFullscreenControl
        initialViewState={{
          bounds: metadata.bbox,
          fitBoundsOptions: fitBoundOpts
        }}
      >
        {boundary != null &&
          <Source id='child-areas-polygon' type='geojson' data={boundary}>
            <Layer {...areaPolygonStyle} />
          </Source>}
      </GlobalMap>
    </div>
  )
}

export default AreaMap

export const LazyAreaMap = dynamic<AreaMapProps>(async () => await import('./AreaMap').then(
  module => module.default), {
  ssr: false
})

const areaPolygonStyle: LineLayer = {
  id: 'polygon',
  type: 'line',
  paint: {
    'line-opacity': ['step', ['zoom'], 0.85, 10, 0.5],
    'line-width': ['step', ['zoom'], 4, 8, 6],
    'line-color': 'rgb(219,39,119)',
    'line-blur': 4
  }
}
