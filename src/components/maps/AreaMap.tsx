'use client'
import { Source, Layer, LineLayer } from 'react-map-gl'
import dynamic from 'next/dynamic'
import { lineString } from '@turf/helpers'
import lineToPolygon from '@turf/line-to-polygon'

import { AreaMetadataType, AreaType } from '../../js/types'
import { GlobalMap } from './GlobalMap'

type ChildArea = Pick<AreaType, 'uuid' | 'areaName'> & { metadata: Pick<AreaMetadataType, 'lat' | 'lng' | 'leaf' | 'bbox' | 'polygon'> }
interface AreaMapProps {
  subAreas: ChildArea[]
  area: AreaType
  focused: string | null
  selected: string | null
}

/**
 * Area map to be included on the area page
 */
const AreaMap: React.FC<AreaMapProps> = ({ area, subAreas }) => {
  let fitBoundOpts: maplibregl.FitBoundsOptions = { padding: { top: 45, left: 45, bottom: 45, right: 45 }, duration: 0, maxZoom: 12 }
  if (subAreas.length === 0) {
    fitBoundOpts = { maxZoom: 14, duration: 0 }
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
