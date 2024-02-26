'use client'
import { useCallback, useState } from 'react'
import { Map, ScaleControl, FullscreenControl, NavigationControl, MapLayerMouseEvent, MapInstance } from 'react-map-gl/maplibre'
import maplibregl, { MapLibreEvent } from 'maplibre-gl'
import { Point, Polygon } from '@turf/helpers'
import dynamic from 'next/dynamic'

import { MAP_STYLES } from './BaseMap'
import { AreaInfoDrawer } from './AreaInfoDrawer'
import { AreaInfoHover } from './AreaInfoHover'
import { SelectedFeature } from './AreaActiveMarker'
import { OBCustomLayers } from './OBCustomLayers'
import { AreaType, ClimbType } from '@/js/types'
import { TileProps, transformTileProps } from './utils'

export type SimpleClimbType = Pick<ClimbType, 'id' | 'name' | 'type'>

export type MapAreaFeatureProperties = Pick<AreaType, 'id' | 'areaName' | 'content' | 'ancestors' | 'pathTokens'> & {
  climbs: SimpleClimbType[]
}

export interface HoverInfo {
  geometry: Point | Polygon
  data: MapAreaFeatureProperties
  mapInstance: MapInstance
}

interface GlobalMapProps {
  showFullscreenControl?: boolean
  initialCenter?: [number, number]
  initialViewState?: {
    bounds: any
    fitBoundsOptions: any
  }
  children?: React.ReactNode
}

/**
 * Global map
 */
export const GlobalMap: React.FC<GlobalMapProps> = ({
  showFullscreenControl = true, initialCenter, initialViewState, children
}) => {
  const [clickInfo, setClickInfo] = useState<MapAreaFeatureProperties | null>(null)
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null)
  const [selected, setSelected] = useState<Point | Polygon | null>(null)
  const [mapInstance, setMapInstance] = useState<MapInstance | null>(null)
  const [cursor, setCursor] = useState<string>('default')

  const onLoad = useCallback((e: MapLibreEvent) => {
    setMapInstance(e.target)
    if (initialCenter != null) {
      e.target.jumpTo({ center: initialCenter, zoom: 6 })
    } else if (initialViewState != null) {
      e.target.fitBounds(initialViewState.bounds, initialViewState.fitBoundsOptions)
    }
  }, [initialCenter])

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
            data: transformTileProps(feature.properties as TileProps),
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
        mapLib={maplibregl}
        id='global-map'
        onLoad={onLoad}
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
        mapStyle={MAP_STYLES.dataviz}
        cursor={cursor}
        cooperativeGestures={showFullscreenControl}
        interactiveLayerIds={['crags', 'crag-group-boundaries']}
      >
        <OBCustomLayers />
        <ScaleControl />
        {showFullscreenControl && <FullscreenControl />}
        <NavigationControl showCompass={false} position='bottom-right' />
        {selected != null &&
          <SelectedFeature geometry={selected} />}
        <AreaInfoDrawer data={clickInfo} />
        {hoverInfo != null && <AreaInfoHover {...hoverInfo} />}
        {children}
      </Map>
    </div>
  )
}

export const LazyGlobalMap = dynamic<GlobalMapProps>(async () => await import('./GlobalMap').then(
  module => module.GlobalMap), {
  ssr: false
})
