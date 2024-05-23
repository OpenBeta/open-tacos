'use client'
import { useCallback, useState } from 'react'
import { Map, FullscreenControl, ScaleControl, NavigationControl, MapLayerMouseEvent, Marker, MapInstance, MarkerDragEvent } from 'react-map-gl/maplibre'
import maplibregl, { MapLibreEvent } from 'maplibre-gl'
import dynamic from 'next/dynamic'
import { useDebouncedCallback } from 'use-debounce'
import { MAP_STYLES, type MapStyles } from './MapSelector'
import { useFormContext } from 'react-hook-form'
import MapLayersSelector from './MapLayersSelector'
import { MapPin } from '@phosphor-icons/react/dist/ssr'
import { CoordinatePickerPopup } from './CoordinatePickerPopup'

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
  initialViewState?: {
    bounds: maplibregl.LngLatBoundsLike
    fitBoundsOptions: maplibregl.FitBoundsOptions
  }
  onCoordinateConfirmed?: (coordinates: [number, number] | null) => void
  name?: string
}

export const CoordinatePickerMap: React.FC<CoordinatePickerMapProps> = ({
  showFullscreenControl = true, initialCenter, onCoordinateConfirmed
}) => {
  const [selectedCoord, setSelectedCoord] = useState({ lng: 0, lat: 0 })
  const [cursor, setCursor] = useState<string>('default')
  const [mapStyle, setMapStyle] = useState<string>(MAP_STYLES.standard.style)
  const [mapInstance, setMapInstance] = useState<MapInstance | null>(null)
  const [popupOpen, setPopupOpen] = useState(false)
  const initialZoom = 14

  const { setValue } = useFormContext()

  const onLoad = useCallback((e: MapLibreEvent) => {
    if (e.target == null) return
    setMapInstance(e.target)
    if (initialCenter != null) {
      e.target.jumpTo({ center: initialCenter, zoom: initialZoom ?? 6 })
    }
  }, [initialCenter])

  const updateCoordinates = useDebouncedCallback((lng, lat) => {
    setSelectedCoord({ lng, lat })
    setPopupOpen(true)
  }, 100)

  const onClick = useCallback((event: MapLayerMouseEvent): void => {
    const { lngLat } = event
    setPopupOpen(false)
    updateCoordinates(lngLat.lng, lngLat.lat)
  }, [updateCoordinates])

  const onMarkerDragEnd = (event: MarkerDragEvent): void => {
    const { lngLat } = event
    setPopupOpen(false)
    updateCoordinates(lngLat.lng, lngLat.lat)
  }

  const confirmSelection = (): void => {
    if (selectedCoord != null) {
      setValue('latlngStr', `${selectedCoord.lat.toFixed(5)},${selectedCoord.lng.toFixed(5)}`, { shouldDirty: true, shouldValidate: true })
      if (onCoordinateConfirmed != null) {
        onCoordinateConfirmed([selectedCoord.lng, selectedCoord.lat])
      }
      setPopupOpen(false)
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
          setPopupOpen(false)
          setCursor('move')
        }}
        onDragEnd={() => {
          if (selectedCoord != null) {
            setPopupOpen(true)
          }
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
            <Marker longitude={selectedCoord.lng} latitude={selectedCoord.lat} draggable onDragEnd={onMarkerDragEnd}>
              <MapPin size={36} weight='fill' className='text-accent' />
            </Marker>
            <CoordinatePickerPopup
              info={{ coordinates: selectedCoord, mapInstance }}
              onConfirm={confirmSelection}
              onClose={() => setPopupOpen(false)}
              open={popupOpen}
            />
          </>
        )}
      </Map>
    </div>
  )
}

export const LazyCoordinatePickerMap = dynamic<CoordinatePickerMapProps>(async () => await import('./CoordinatePickerMap').then(
  module => module.CoordinatePickerMap), {
  ssr: false
})
