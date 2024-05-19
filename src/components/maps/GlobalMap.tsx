'use client'
import { useCallback, useState } from 'react'
import { Map, FullscreenControl, ScaleControl, NavigationControl, MapLayerMouseEvent, MapInstance, ViewStateChangeEvent } from 'react-map-gl/maplibre'
import maplibregl, { MapLibreEvent } from 'maplibre-gl'
import dynamic from 'next/dynamic'
import { Geometry } from 'geojson'

import { MAP_STYLES, type MapStyles } from './MapSelector'
import { AreaInfoDrawer } from './TileHandlers/AreaInfoDrawer'
import { AreaInfoHover } from './TileHandlers/AreaInfoHover'
import { SelectedFeature } from './AreaActiveMarker'
import { OBCustomLayers } from './OBCustomLayers'
import { tileToFeature } from './utils'
import { ActiveFeature, TileProps } from './TileTypes'
import MapLayersSelector from './MapLayersSelector'
import { debounce } from 'underscore'
import { MapToolbar } from './MapToolbar'

export interface CameraInfo {
  center: {
    lng: number
    lat: number
  }
  zoom: number
}

export interface DataLayersDisplayState {
  cragGroups: boolean
  organizations: boolean
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
  const [clickInfo, setClickInfo] = useState<ActiveFeature | null>(null)
  const [hoverInfo, setHoverInfo] = useState < ActiveFeature | null>(null)
  const [selected, setSelected] = useState<Geometry | null>(null)
  const [mapInstance, setMapInstance] = useState<MapInstance | null>(null)
  const [cursor, setCursor] = useState<string>('default')
  const [mapStyle, setMapStyle] = useState<string>(MAP_STYLES.standard.style)
  const [dataLayersDisplayState, setDataLayersDisplayState] = useState<DataLayersDisplayState>({
    cragGroups: false,
    organizations: false
  })

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
    if (initialCenter != null) {
      e.target.jumpTo({ center: initialCenter, zoom: initialZoom ?? 6 })
    } else if (initialViewState != null) {
      e.target.fitBounds(initialViewState.bounds, initialViewState.fitBoundsOptions)
    }
  }, [initialCenter, initialZoom])

  /**
   * Handle click event on the map. Place a market on the map and activate the side drawer.
   */
  const onClick = useCallback((event: MapLayerMouseEvent): void => {
    const feature = event?.features?.[0]
    if (feature == null || mapInstance == null) {
      setSelected(null)
      setClickInfo(null)
    } else {
      const { layer, geometry, properties } = feature
      setSelected(feature.geometry)
      setClickInfo(tileToFeature(layer.id, event.point, geometry, properties as TileProps, mapInstance))
    }
  }, [mapInstance])

  /**
   * Handle click event on the popover.  Behave as if the user clicked on a feature on the map.
   */
  const onHoverCardClick = (feature: ActiveFeature): void => {
    setSelected(feature.geometry)
    setClickInfo(feature)
  }

  /**
   * Handle over event on the map.  Show the popover with the area info.
   */
  const onHover = useCallback((event: MapLayerMouseEvent) => {
    const obLayerId = event.features?.findIndex((f) => f.layer.id === 'crag-markers' || f.layer.id === 'crag-name-labels' || f.layer.id === 'crag-group-boundaries') ?? -1

    if (obLayerId !== -1) {
      setCursor('pointer')
      const feature = event.features?.[obLayerId]
      if (feature != null && mapInstance != null) {
        const { layer, geometry, properties } = feature
        setHoverInfo(tileToFeature(layer.id, event.point, geometry, properties as TileProps, mapInstance))
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
        interactiveLayerIds={['crag-markers', 'crag-name-labels', 'crag-group-boundaries', 'organizations']}
      >
        <MapToolbar layerState={dataLayersDisplayState} onChange={setDataLayersDisplayState} />
        <MapLayersSelector emit={updateMapLayer} />
        <ScaleControl unit='imperial' style={{ marginBottom: 10 }} position='bottom-left' />
        <ScaleControl unit='metric' style={{ marginBottom: 0 }} position='bottom-left' />

        <OBCustomLayers layersState={dataLayersDisplayState} />
        {showFullscreenControl && <FullscreenControl />}
        <NavigationControl showCompass={false} position='bottom-right' />
        {selected != null &&
          <SelectedFeature geometry={selected} />}
        <AreaInfoDrawer feature={clickInfo} />
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
