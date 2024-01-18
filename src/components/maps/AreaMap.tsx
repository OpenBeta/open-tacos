'use client'
import { useRef, useState } from 'react'
import { Map, ScaleControl, FullscreenControl, NavigationControl, Source, Layer, FillLayer, MapLayerMouseEvent } from 'react-map-gl'
import dynamic from 'next/dynamic'
import { Padding } from '@math.gl/web-mercator/dist/fit-bounds'
import { lineString } from '@turf/helpers'
import lineToPolygon from '@turf/line-to-polygon'
import { useDebouncedCallback } from 'use-debounce'

import { AreaMetadataType, AreaType } from '../../js/types'
import { MAP_STYLES } from './BaseMap'
import { MouseoverPanel } from './MouseoverPanel'

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
  parent: {
    id: string
    name: string
  }
}

/**
 * Area map
 */
const AreaMap: React.FC<AreaMapProps> = ({ area, subAreas }) => {
  const [hovered, setHovered] = useState<MapAreaFeatureProperties | null>(null)
  const mapRef = useRef(null)
  let padding: Padding = { top: 45, left: 45, bottom: 45, right: 45 }
  if (subAreas.length === 0) {
    padding = { top: 100, left: 100, bottom: 100, right: 100 }
  }

  const { metadata } = area

  const boundary = metadata?.polygon == null ? null : lineToPolygon(lineString(metadata.polygon), { properties: { name: area.areaName } })

  const onMouseEnter = (event: MapLayerMouseEvent): void => {
    console.log('onMouseEnter', event)
    const feature = event?.features?.[0]
    if (feature != null) {
      setHovered(feature.properties as MapAreaFeatureProperties)
    }
  }

  return (
    <div className='relative w-full h-full'>
      <Map
        ref={mapRef}
        id='map'
        initialViewState={{
          bounds: metadata.bbox,
          fitBoundsOptions: { padding }
        }}
        onMouseMove={useDebouncedCallback(onMouseEnter, 200, { leading: true, maxWait: 200 })}
        reuseMaps
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        mapStyle={MAP_STYLES.light}
        cooperativeGestures
        interactiveLayerIds={['crags']}
      >
        <ScaleControl />
        <FullscreenControl />
        <NavigationControl showCompass={false} />
        {hovered != null && <MouseoverPanel {...hovered} />}
        {boundary != null &&
          <Source id='child-areas-polygon' type='geojson' data={boundary}>
            <Layer {...areaPolygonStyle} />
          </Source>}
      </Map>
    </div>
  )
}

export default AreaMap

export const LazyAreaMap = dynamic<AreaMapProps>(async () => await import('./AreaMap').then(
  module => module.default), {
  ssr: false
})

const areaPolygonStyle: FillLayer = {
  id: 'polygon',
  type: 'fill',
  paint: {
    'fill-antialias': true,
    'fill-color': 'rgb(236,72,153)',
    'fill-opacity': ['step', ['zoom'], 0.2, 15, 0]
  }
}
