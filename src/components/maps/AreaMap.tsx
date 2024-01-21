'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Map, ScaleControl, FullscreenControl, NavigationControl, Source, Layer, MapLayerMouseEvent, LineLayer, MapInstance } from 'react-map-gl'
import dynamic from 'next/dynamic'
import { lineString, Point, Polygon, point } from '@turf/helpers'
import lineToPolygon from '@turf/line-to-polygon'

import { AreaMetadataType, AreaType } from '../../js/types'
import { MAP_STYLES } from './BaseMap'
import { AreaInfoDrawer } from './AreaInfoDrawer'
import { AreaInfoHover } from './AreaInfoHover'
import { SelectedFeature } from './AreaActiveMarker'

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
  const [clickInfo, setClickInfo] = useState<MapAreaFeatureProperties | null>(null)
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null)
  const [selected, setSelected] = useState<Point | Polygon | null>(null)
  const [mapInstance, setMapInstance] = useState<MapInstance | null>(null)
  const [cursor, setCursor] = useState<string>('default')
  const mapRef = useRef<any>(null)

  let fitBoundOpts: any = { padding: { top: 45, left: 45, bottom: 45, right: 45 } }
  if (subAreas.length === 0) {
    fitBoundOpts = { maxZoom: 14 }
  }

  const { metadata } = area
  const boundary = metadata?.polygon == null ? null : lineToPolygon(lineString(metadata.polygon), { properties: { name: area.areaName } })

  useEffect(() => {
    if (mapRef.current != null) {
      setMapInstance(mapRef.current)
    }
    /**
     * Show drop pin if viewing a leaf area
     */
    if (metadata.leaf) {
      setSelected(point([metadata.lng, metadata.lat]).geometry as unknown as Point)
    }
  }, [metadata.leaf, mapRef?.current])

  const onClick = useCallback((event: MapLayerMouseEvent): void => {
    const feature = event?.features?.[0]
    if (feature == null) {
      setSelected(null)
      setClickInfo(null)
    } else {
      setSelected(feature.geometry as Point | Polygon)
      setClickInfo(feature.properties as MapAreaFeatureProperties)
    }
  }, [mapInstance])

  const onHover = useCallback((event: MapLayerMouseEvent) => {
    const obLayerId = event.features?.findIndex((f) => f.layer.id === 'crags' || f.layer.id === 'crag-group-boundaries') ?? -1

    if (obLayerId !== -1) {
      setCursor('pointer')
      const feature = event.features?.[obLayerId]
      if (feature != null && mapInstance != null) {
        const { geometry } = feature
        if (geometry.type === 'Point' || geometry.type === 'Polygon') {
          setHoverInfo({
            geometry: feature.geometry as Point | Polygon,
            data: feature.properties as MapAreaFeatureProperties,
            mapInstance
          })
        }
      }
    } else {
      setHoverInfo(null)
      setCursor('default')
    }
  }, [mapInstance])

  return (
    <div className='relative w-full h-full'>
      <Map
        ref={mapRef}
        id='map'
        initialViewState={{
          bounds: metadata.bbox,
          fitBoundsOptions: fitBoundOpts
        }}
        onDragStart={() => {
          setCursor('move')
        }}
        onDragEnd={() => {
          setCursor('default')
        }}
        onMouseEnter={onHover}
        onMouseLeave={() => {
          setHoverInfo(null)
          setCursor('default')
        }}
        onClick={onClick}
        reuseMaps
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        mapStyle={MAP_STYLES.light}
        cursor={cursor}
        cooperativeGestures
        interactiveLayerIds={['crags', 'crag-group-boundaries']}
      >
        <ScaleControl />
        <FullscreenControl />
        <NavigationControl showCompass={false} />
        {selected != null &&
          <SelectedFeature geometry={selected} />}
        <AreaInfoDrawer data={clickInfo} />
        {boundary != null &&
          <Source id='child-areas-polygon' type='geojson' data={boundary}>
            <Layer {...areaPolygonStyle} />
          </Source>}
        {hoverInfo != null && <AreaInfoHover {...hoverInfo} />}
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
    'line-width': ['step', ['zoom'], 2, 10, 8],
    'line-color': 'rgb(219,39,119)',
    'line-blur': 4
  }
}
