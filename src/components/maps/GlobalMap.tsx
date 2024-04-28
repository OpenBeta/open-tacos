'use client'
import { useCallback, useState } from 'react'
import { Map, FullscreenControl, ScaleControl, NavigationControl, MapLayerMouseEvent, MapInstance, ViewStateChangeEvent } from 'react-map-gl/maplibre'
import maplibregl, { MapLibreEvent } from 'maplibre-gl'
import { Point, Polygon } from '@turf/helpers'
import dynamic from 'next/dynamic'

import { MAP_STYLES, type MapStyles } from './MapSelector'
import { AreaInfoDrawer } from './AreaInfoDrawer'
import { AreaInfoHover } from './AreaInfoHover'
import { SelectedFeature } from './AreaActiveMarker'
import { OBCustomLayers } from './OBCustomLayers'
import { AreaType, ClimbType, MediaWithTags } from '@/js/types'
import { TileProps, transformTileProps } from './utils'
import MapLayersSelector from './MapLayersSelector'
import { debounce } from 'underscore'

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

export interface CameraInfo {
  center: {
    lng: number
    lat: number
  }
  zoom: number
}

interface GlobalMapProps {
  showFullscreenControl?: boolean
  initialCenter?: [number, number]
  initialZoom?: number
  initialViewState?: {
    bounds: maplibregl.LngLatBoundsLike
    fitBoundsOptions: maplibregl.FitBoundsOptions
  }
  onCameraMovement?: (camera: CameraInfo) => void
  children?: React.ReactNode
}

/**
 * Global map
 */
export const GlobalMap: React.FC<GlobalMapProps> = ({
  showFullscreenControl = true, initialCenter, initialZoom, initialViewState, onCameraMovement, children
}) => {
  const [clickInfo, setClickInfo] = useState<MapAreaFeatureProperties | null>(null)
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null)
  const [selected, setSelected] = useState<Point | Polygon | null>(null)
  const [mapInstance, setMapInstance] = useState<MapInstance | null>(null)
  const [cursor, setCursor] = useState<string>('default')
  const [mapStyle, setMapStyle] = useState<string>(MAP_STYLES.standard.style)

  const onMove = useCallback(debounce((e: ViewStateChangeEvent) => {
    if (onCameraMovement != null) {
      onCameraMovement({
        center: {
          lat: e.viewState.latitude,
          lng: e.viewState.longitude
        },
        zoom: e.viewState.zoom
      })
    }
  }, 300), [])

  const onLoad = useCallback((e: MapLibreEvent) => {
    if (e.target == null) return
    setMapInstance(e.target)
    if (initialCenter != null && initialZoom != null) {
      e.target.jumpTo({ center: initialCenter, zoom: initialZoom })
    } else if (initialViewState != null) {
      e.target.fitBounds(initialViewState.bounds, initialViewState.fitBoundsOptions)
    }
  }, [initialCenter])

  /**
   * Handle click event on the map. Place a market on the map and activate the side drawer.
   */
  const onClick = useCallback((event: MapLayerMouseEvent): void => {
    const feature = event?.features?.[0]
    if (feature == null) {
      setSelected(null)
      setClickInfo(null)
    } else {
      setSelected(feature.geometry as Point | Polygon)
      setClickInfo(transformTileProps(feature.properties as TileProps))
    }
  }, [mapInstance])

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

  const updateMapLayer = (key: keyof MapStyles): void => {
    const style = MAP_STYLES[key]
    setMapStyle(style.style)
  }

  return (
    <div className='relative w-full h-full'>
      <Map
        id='global-map'
        onLoad={onLoad}
        onDragStart={() => {
          setCursor('move')
        }}
        onMove={onMove}
        onDragEnd={() => {
          setCursor('default')
        }}
        onMouseEnter={onHover}
        onMouseLeave={() => {
          setHoverInfo(null)
          setCursor('default')
        }}
        onClick={onClick}
        mapStyle={mapStyle}
        cursor={cursor}
        cooperativeGestures={showFullscreenControl}
        interactiveLayerIds={['crags', 'crag-group-boundaries']}
      >
        <MapLayersSelector emit={updateMapLayer} />
        <ScaleControl unit='imperial' style={{ marginBottom: 10 }} position='bottom-left' />
        <ScaleControl unit='metric' style={{ marginBottom: 0 }} position='bottom-left' />

        <OBCustomLayers />
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
