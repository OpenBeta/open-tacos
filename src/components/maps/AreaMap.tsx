'use client'
import { useEffect, useRef, useState } from 'react'
import { Map, ScaleControl, FullscreenControl, NavigationControl, Source, Layer, MapLayerMouseEvent, LineLayer } from 'react-map-gl'
import dynamic from 'next/dynamic'
import { lineString, Point, point } from '@turf/helpers'
import lineToPolygon from '@turf/line-to-polygon'
import { useDebouncedCallback } from 'use-debounce'

import { AreaMetadataType, AreaType } from '../../js/types'
import { MAP_STYLES } from './BaseMap'
import { AreaInfoDrawer } from './AreaInfoDrawer'
import { AreaActiveMarker } from './AreaActiveMarker'

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
  parent: string // due to a backend backend bug, this is a string instead of a parent object
  // parent: {
  //   id: string
  //   name: string
  // }
}

/**
 * Area map
 */
const AreaMap: React.FC<AreaMapProps> = ({ area, subAreas }) => {
  const [hovered, setHovered] = useState<MapAreaFeatureProperties | null>(null)
  const [selected, setSelected] = useState<Point | null>(null)
  const mapRef = useRef(null)
  let fitBoundOpts: any = { padding: { top: 45, left: 45, bottom: 45, right: 45 } }
  if (subAreas.length === 0) {
    fitBoundOpts = { maxZoom: 14 }
  }

  const { metadata } = area
  const boundary = metadata?.polygon == null ? null : lineToPolygon(lineString(metadata.polygon), { properties: { name: area.areaName } })

  const onClick = (event: MapLayerMouseEvent): void => {
    const feature = event?.features?.[0]
    if (feature == null) {
      setSelected(null)
      setHovered(null)
    } else {
      setSelected(feature.geometry as unknown as Point)
      setHovered(feature.properties as MapAreaFeatureProperties)
    }
  }

  useEffect(() => {
    /**
     * Show drop pin if viewing a leaf area
     */
    if (metadata.leaf) {
      setSelected(point([metadata.lng, metadata.lat]).geometry as unknown as Point)
    }
  }, [metadata.leaf])
  return (
    <div className='relative w-full h-full'>
      <Map
        ref={mapRef}
        id='map'
        initialViewState={{
          bounds: metadata.bbox,
          fitBoundsOptions: fitBoundOpts
        }}
        onClick={useDebouncedCallback(onClick, 200, { leading: true, maxWait: 200 })}
        reuseMaps
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        mapStyle={MAP_STYLES.light}
        cooperativeGestures
        interactiveLayerIds={['crags']}
      >
        <ScaleControl />
        <FullscreenControl />
        <NavigationControl showCompass={false} />
        {selected != null &&
          <AreaActiveMarker point={selected} />}
        <AreaInfoDrawer data={hovered} />
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

const areaPolygonStyle: LineLayer = {
  id: 'polygon',
  type: 'line',
  paint: {
    'line-opacity': ['step', ['zoom'], 0.85, 10, 0.5],
    'line-width': ['step', ['zoom'], 2, 10, 6],
    'line-color': 'rgb(219,39,119)'
  }
}
