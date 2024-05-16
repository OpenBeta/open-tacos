'use client'
import { useCallback, useState } from 'react'
import { Map, FullscreenControl, ScaleControl, NavigationControl, MapLayerMouseEvent, ViewStateChangeEvent, Marker, Popup } from 'react-map-gl/maplibre'
import maplibregl, { MapLibreEvent } from 'maplibre-gl'
import dynamic from 'next/dynamic'
import { debounce } from 'underscore'

import { MAP_STYLES, type MapStyles } from './MapSelector'
import { useFormContext } from 'react-hook-form'
import MapLayersSelector from './MapLayersSelector'

export interface CameraInfo {
  center: {
    lng: number
    lat: number
  }
  zoom: number
}

interface CoordinatePickerMapProps {
  showFullscreenControl?: boolean
  initialCenter?: [number, number]
  initialZoom?: number
  initialViewState?: {
    bounds: maplibregl.LngLatBoundsLike
    fitBoundsOptions: maplibregl.FitBoundsOptions
  }
  onCameraMovement?: (camera: CameraInfo) => void
  onCoordinateConfirmed?: (coordinates: [number, number] | null) => void
  name?: string
  children?: React.ReactNode
}

/**
 * Coordinate Picker Map
 */
export const CoordinatePickerMap: React.FC<CoordinatePickerMapProps> = ({
  showFullscreenControl = true, initialCenter, initialZoom, initialViewState, onCameraMovement, onCoordinateConfirmed, children
}) => {
  const [selectedCoord, setSelectedCoord] = useState<[number, number] | null>(null)
  const [cursor, setCursor] = useState<string>('default')
  const [mapStyle, setMapStyle] = useState<string>(MAP_STYLES.standard.style)

  const { setValue } = useFormContext()

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
    if (initialCenter != null) {
      e.target.jumpTo({ center: initialCenter, zoom: initialZoom ?? 6 })
    } else if (initialViewState != null) {
      e.target.fitBounds(initialViewState.bounds, initialViewState.fitBoundsOptions)
    }
  }, [initialCenter, initialZoom])

  /**
   * Handle click event on the map. Place or replace a marker.
   */
  const onClick = useCallback((event: MapLayerMouseEvent): void => {
    const { lngLat } = event
    setSelectedCoord([lngLat.lng, lngLat.lat])
  }, [])

  const confirmSelection = (): void => {
    if (selectedCoord != null) {
      setValue('latlngStr', `${selectedCoord[1].toFixed(5)},${selectedCoord[0].toFixed(5)}`)
    }
    if ((onCoordinateConfirmed != null) && (selectedCoord != null)) {
      onCoordinateConfirmed(selectedCoord)
    }
  }

  const updateMapLayer = (key: keyof MapStyles): void => {
    const style = MAP_STYLES[key]
    setMapStyle(style.style)
  }

  return (
    <div className='relative w-full h-full'>
      <Map
        id='coordinate-picker-map'
        onLoad={onLoad}
        onDragStart={() => {
          setCursor('move')
        }}
        onMove={onMove}
        onDragEnd={() => {
          setCursor('default')
        }}
        onClick={onClick}
        mapStyle={mapStyle}
        cursor={cursor}
        cooperativeGestures={showFullscreenControl}
      >
        <MapLayersSelector emit={updateMapLayer} />

        <ScaleControl unit='imperial' style={{ marginBottom: 10 }} position='bottom-left' />
        <ScaleControl unit='metric' style={{ marginBottom: 0 }} position='bottom-left' />
        {showFullscreenControl && <FullscreenControl />}
        <NavigationControl showCompass={false} position='bottom-right' />
        {(selectedCoord != null) && (
          <>
            <Marker longitude={selectedCoord[0]} latitude={selectedCoord[1]} />
            <Popup longitude={selectedCoord[0]} latitude={selectedCoord[1]} closeOnClick={false} anchor='top'>
              <div>
                <p>Coordinates: {selectedCoord[1].toFixed(5)}, {selectedCoord[0].toFixed(5)}</p>
                <button className='btn btn-primary' onClick={confirmSelection}>Confirm</button>
              </div>
            </Popup>
          </>
        )}
        {children}
      </Map>
    </div>
  )
}

export const LazyCoordinatePickerMap = dynamic<CoordinatePickerMapProps>(async () => await import('./CoordinatePickerMap').then(
  module => module.CoordinatePickerMap), {
  ssr: false
})
