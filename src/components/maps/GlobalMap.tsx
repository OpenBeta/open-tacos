'use client'
import { useCallback, useState } from 'react'
import { Map, ScaleControl, FullscreenControl, NavigationControl, MapLayerMouseEvent, MapInstance } from 'react-map-gl/maplibre'
import maplibregl, { MapLibreEvent } from 'maplibre-gl'
import { Point, Polygon } from '@turf/helpers'
import dynamic from 'next/dynamic'

import { MAP_STYLES } from './MapSelector'
import { AreaInfoDrawer } from './AreaInfoDrawer'
import { AreaInfoHover } from './AreaInfoHover'
import { SelectedFeature } from './AreaActiveMarker'
import { OBCustomLayers } from './OBCustomLayers'
import { AreaType, ClimbType, MediaWithTags } from '@/js/types'
import { TileProps, transformTileProps } from './utils'
import Spinner from '../ui/Spinner'

export type SimpleClimbType = Pick<ClimbType, 'id' | 'name' | 'type'>

export type MediaWithTagsInMapTile = Omit<MediaWithTags, 'id'> & { _id: string }
export type MapAreaFeatureProperties = Pick<AreaType, 'id' | 'areaName' | 'content' | 'ancestors' | 'pathTokens'> & {
  climbs: SimpleClimbType[]
  media: MediaWithTagsInMapTile[]
}

export interface HoverInfo {
  geometry: Point | Polygon
  data: MapAreaFeatureProperties
  mapInstance: MapInstance
}

interface GlobalMapProps {
  showFullscreenControl?: boolean
  initialCenter?: [number, number]
  initialZoom?: number
  initialViewState?: {
    bounds: maplibregl.LngLatBoundsLike
    fitBoundsOptions: maplibregl.FitBoundsOptions
  }
  children?: React.ReactNode
}

interface GlobalMapSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string
  height?: string
}

export const GlobalMapSkeleton: React.FC<GlobalMapSkeletonProps> = ({
  ...props
}) => {
  return (
    <div
      className='relative animate-pulse rounded-md bg-gray-300 w-full h-full'
      {...props}
    >
      <div className='flex justify-center items-center h-full'>
        <Spinner />
      </div>
    </div>
  )
}

/**
 * Global map
 */
export const GlobalMap: React.FC<GlobalMapProps> = ({
  showFullscreenControl = true, initialCenter, initialZoom, initialViewState, children
}) => {
  const [clickInfo, setClickInfo] = useState<MapAreaFeatureProperties | null>(null)
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null)
  const [selected, setSelected] = useState<Point | Polygon | null>(null)
  const [mapInstance, setMapInstance] = useState<MapInstance | null>(null)
  const [cursor, setCursor] = useState<string>('default')
  const [mapLoaded, setMapLoaded] = useState(false)

  const onLoad = useCallback((e: MapLibreEvent) => {
    setMapInstance(e.target)
    if (initialCenter != null && initialZoom != null) {
      e.target.jumpTo({ center: initialCenter, zoom: initialZoom })
    } else if (initialViewState != null) {
      e.target.fitBounds(initialViewState.bounds, initialViewState.fitBoundsOptions)
    }
    setMapLoaded(true)
  }, [initialCenter])

  /**
   * Handle click event on the map. Place a market on the map and activate the side drawer.
   */
  const onClick = useCallback((e: MapLibreEvent) => {
    setMapInstance(e.target)
    if (initialCenter != null && initialZoom != null) {
      e.target.jumpTo({ center: initialCenter, zoom: initialZoom })
    } else if (initialViewState != null) {
      e.target.fitBounds(initialViewState.bounds, initialViewState.fitBoundsOptions)
    }
    setMapLoaded(true)
  }, [initialCenter, initialZoom, initialViewState])

  /**
   * Handle click event on the popover.  Behave as if the user clicked on a feature on the map.
   */
  const onHoverCardClick = ({ geometry, data }: HoverInfo): void => {
    setSelected(geometry)
    setClickInfo(data)
  }

  /**
   * Handle over event on the map.  Show the popover with the area info.
   */
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
        initialViewState={{
          latitude: (initialCenter != null) ? initialCenter[1] : undefined,
          longitude: (initialCenter != null) ? initialCenter[0] : undefined,
          zoom: initialZoom
        }}
        onDragStart={() => {
          setCursor('move')
        }}
        onDragEnd={() => {
          setCursor('default')
        }}
        onMoveEnd={(e) => {
          if (mapLoaded) {
            const zoomLevel = Math.round(e.target.getZoom())
            const center = e.target.getCenter()
            const params = new URLSearchParams({
              zoom: zoomLevel.toString(),
              center: `${center.lat.toFixed(3)},${center.lng.toFixed(3)}`
            })
            const pathname = '/maps'
            window.history.pushState({}, '', `${pathname}?${params.toString()}`)
          }
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
        {hoverInfo != null && (
          <AreaInfoHover
            {...hoverInfo}
            onClick={onHoverCardClick}
          />)}
        {children}
      </Map>
    </div>
  )
}

export const LazyGlobalMap = dynamic<GlobalMapProps>(async () => await import('./GlobalMap').then(
  module => module.GlobalMap), {
  ssr: false
})
