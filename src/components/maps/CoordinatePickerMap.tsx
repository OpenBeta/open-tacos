import React, { useCallback, useState, useRef } from 'react'
import { Map, FullscreenControl, ScaleControl, NavigationControl, Marker, GeolocateControl, GeolocateResultEvent } from 'react-map-gl/maplibre'
import maplibregl, { MapLibreEvent } from 'maplibre-gl'
import dynamic from 'next/dynamic'
import { useDebouncedCallback } from 'use-debounce'
import { MAP_STYLES, type MapStyles } from './MapSelector'
import { useFormContext } from 'react-hook-form'
import MapLayersSelector from './MapLayersSelector'
import AlertDialog from '../ui/micro/AlertDialogue'
import useResponsive from '@/js/hooks/useResponsive'
import { MapPin, Crosshair } from '@phosphor-icons/react'

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
  const initialZoom = 14
  // const [viewState, setViewState] = useState<Pick<ViewState, 'longitude' | 'latitude' | 'zoom'>>({
  //   longitude: (initialCenter != null) ? initialCenter[0] : 0,
  //   latitude: (initialCenter != null) ? initialCenter[1] : 0,
  //   zoom: initialZoom
  // })
  const [newSelectedCoord, setNewSelectedCoord] = useState<{ lng: number, lat: number }>({ lng: 0, lat: 0 })
  const [cursor, setCursor] = useState<string>('default')
  const { isMobile } = useResponsive()
  const [mapStyle, setMapStyle] = useState<string>(MAP_STYLES.light.style)
  const triggerButtonRef = useRef<HTMLButtonElement>(null)
  const initialCoordinates = initialCenter != null ? { lng: initialCenter[0], lat: initialCenter[1] } : { lng: 0, lat: 0 }
  const { setValue } = useFormContext()

  const onLoad = useCallback((e: MapLibreEvent) => {
    if (e.target == null) return
    if (initialCenter != null) {
      e.target.jumpTo({ center: { lng: initialCenter?.[0] ?? 0, lat: initialCenter?.[1] ?? 0 }, zoom: initialZoom ?? 6 })
    }
  }, [initialCenter])

  const updateCoordinates = useDebouncedCallback((lng, lat) => {
    setNewSelectedCoord({ lng, lat })
  }, 100)

  const confirmSelection = (): void => {
    if (initialCoordinates != null) {
      setValue('latlngStr', `${newSelectedCoord.lat?.toFixed(5) ?? 0},${newSelectedCoord.lng?.toFixed(5) ?? 0}`, { shouldDirty: true, shouldValidate: true })
      if (onCoordinateConfirmed != null) {
        onCoordinateConfirmed([newSelectedCoord.lng ?? 0, newSelectedCoord.lat ?? 0])
      }
    }
  }

  const updateMapLayer = (key: keyof MapStyles): void => {
    const style = MAP_STYLES[key]
    setMapStyle(style.style)
  }

  const handleGeolocate = useCallback((e: GeolocateResultEvent) => {
    const { coords } = e
    if (coords != null) {
      updateCoordinates(coords.longitude, coords.latitude)
    }
  }, [updateCoordinates])

  // const onMove = useCallback(({ viewState }: { viewState: ViewState }) => {
  //   setViewState(viewState)
  //   // updateCoordinates(viewState.longitude, viewState.latitude)
  // }, [])

  const handleClick = (event: any): void => {
    const { lng, lat } = event.lngLat
    // setNewSelectedCoord({ lng, lat })
    updateCoordinates(lng, lat)
    if (triggerButtonRef.current != null) {
      triggerButtonRef.current.click()
    }
  }

  const anchorClass = isMobile
    ? 'fixed bottom-1/4 left-1/2 transform -translate-x-1/2'
    : 'fixed bottom-1/4 left-1/2 transform -translate-x-1/2'

  return (
    <div className='relative w-full h-full'>
      <Map
        id='coordinate-picker-map'
        onLoad={onLoad}
        initialViewState={{
          longitude: initialCoordinates.lng,
          latitude: initialCoordinates.lat,
          zoom: initialZoom
        }}
        onDragStart={() => {
          setCursor('move')
        }}
        onDragEnd={() => {
          setCursor('default')
        }}
        // onMove={onMove}
        onClick={handleClick}
        mapStyle={mapStyle}
        cursor={cursor}
        cooperativeGestures={showFullscreenControl}
      >
        <MapLayersSelector emit={updateMapLayer} />
        <ScaleControl unit='imperial' style={{ marginBottom: 10 }} position='bottom-left' />
        <ScaleControl unit='metric' style={{ marginBottom: 0 }} position='bottom-left' />
        {showFullscreenControl && <FullscreenControl />}
        <GeolocateControl position='top-left' onGeolocate={handleGeolocate} />
        <NavigationControl showCompass={false} position='bottom-right' />
        {(initialCoordinates.lat !== 0 && initialCoordinates.lng !== 0) && (
          <Marker longitude={initialCoordinates.lng} latitude={initialCoordinates.lat} anchor='bottom'>
            <MapPin size={36} weight='fill' className='text-accent' />
          </Marker>
        )}
        <Marker
          draggable
          onDragEnd={(event) => {
            const { lng, lat } = event.lngLat
            console.log('Dragged')
            updateCoordinates(lng, lat)
            if (triggerButtonRef.current != null) {
              triggerButtonRef.current.click()
            }
          }}
          longitude={newSelectedCoord.lng}
          latitude={newSelectedCoord.lat}
          anchor='center'
        >
          <Crosshair size={36} weight='fill' className='text-accent' />
        </Marker>
      </Map>
      <AlertDialog
        title='Confirm Selection'
        button={<button ref={triggerButtonRef} style={{ display: 'none' }}>Open Dialog</button>} // Hidden button as trigger
        confirmText='Confirm'
        cancelText='Cancel'
        onConfirm={confirmSelection}
        onCancel={() => {
          console.log('Cancelled')
        }}
        hideCancel={false}
        hideConfirm={false}
        hideTitle
        customPositionClasses={anchorClass}
      >
        Coordinates: {newSelectedCoord.lat?.toFixed(5) ?? 0}, {newSelectedCoord.lng?.toFixed(5) ?? 0}
      </AlertDialog>
    </div>
  )
}

export const LazyCoordinatePickerMap = dynamic<CoordinatePickerMapProps>(async () => await import('./CoordinatePickerMap').then(
  module => module.CoordinatePickerMap), {
  ssr: false
})
