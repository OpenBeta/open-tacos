'use client'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import { Map, ScaleControl, NavigationControl, Marker, GeolocateControl, GeolocateResultEvent, MapLayerMouseEvent, MapEvent } from 'react-map-gl/maplibre'
import dynamic from 'next/dynamic'
import { useDebouncedCallback } from 'use-debounce'
import { MAP_STYLES, type MapStyles } from '@/components/maps/MapSelector'
import { useFormContext } from 'react-hook-form'
import MapLayersSelector from '@/components/maps/MapLayersSelector'
import AlertDialog from '@/components/ui/micro/AlertDialogue'
import useResponsive from '@/js/hooks/useResponsive'
import { MapPin, Crosshair } from '@phosphor-icons/react'

interface CoordinatePickerMapProps {
  onCoordinateConfirmed: () => void
  name?: string
}

interface Coordinate {
  lat: number
  lng: number
}

interface Coord {
  initialCoordinate: Coordinate | null
  newSelectedCoordinate: Coordinate | null
}

export const CoordinatePickerMap: React.FC<CoordinatePickerMapProps> = ({ onCoordinateConfirmed }) => {
  const initialZoom = 14
  const [cursor, setCursor] = useState<string>('default')
  const [coord, setCoord] = useState<Coord>({
    initialCoordinate: null,
    newSelectedCoordinate: null
  })
  const { initialCoordinate, newSelectedCoordinate } = coord
  const { isMobile } = useResponsive()
  const [mapStyle, setMapStyle] = useState<string>(MAP_STYLES.light.style)
  const triggerButtonRef = useRef<HTMLButtonElement>(null)
  const { watch, setValue } = useFormContext()

  // Watch the 'latlngStr' value from form context
  const watchedCoords = watch('latlngStr') as string

  useEffect(() => {
    if (watchedCoords != null) {
      const [lat, lng] = watchedCoords.split(',').map(Number)
      setCoord({ initialCoordinate: { lat, lng }, newSelectedCoordinate })
    }
  }, [watchedCoords, newSelectedCoordinate])

  const onLoad = useCallback((e: MapEvent) => {
    if (e.target == null || initialCoordinate == null) return
    e.target.jumpTo({ center: { lat: initialCoordinate.lat, lng: initialCoordinate.lng }, zoom: initialZoom })
  }, [initialCoordinate])

  const updateCoordinates = useDebouncedCallback((lng, lat) => {
    setCoord((prev) => ({ initialCoordinate: prev.initialCoordinate, newSelectedCoordinate: { lat, lng } }))
  }, 100)

  const confirmSelection = (): void => {
    if (newSelectedCoordinate !== null) {
      setValue('latlngStr', `${newSelectedCoordinate.lat.toFixed(5)},${newSelectedCoordinate.lng.toFixed(5)}`, { shouldDirty: true, shouldValidate: true })
      onCoordinateConfirmed()
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

  const handleClick = (event: MapLayerMouseEvent): void => {
    const { lng, lat } = event.lngLat
    updateCoordinates(lng, lat)
    if (triggerButtonRef.current != null) {
      triggerButtonRef.current.click()
    }
  }

  const anchorClass = isMobile
    ? 'fixed bottom-2 left-1/2 transform -translate-x-1/2'
    : 'fixed bottom-1/4 left-1/2 transform -translate-x-1/2'

  return (
    <div className='relative w-full h-full'>
      <Map
        id='coordinate-picker-map'
        onLoad={onLoad}
        initialViewState={{
          longitude: initialCoordinate?.lng,
          latitude: initialCoordinate?.lat,
          zoom: initialZoom
        }}
        onDragStart={() => {
          setCursor('move')
        }}
        onDragEnd={() => {
          setCursor('default')
        }}
        onClick={handleClick}
        mapStyle={mapStyle}
        cursor={cursor}
      >
        <MapLayersSelector emit={updateMapLayer} />
        <ScaleControl unit='imperial' style={{ marginBottom: 10 }} position='bottom-left' />
        <ScaleControl unit='metric' style={{ marginBottom: 0 }} position='bottom-left' />
        <GeolocateControl position='top-left' onGeolocate={handleGeolocate} />
        <NavigationControl showCompass={false} position='bottom-right' />
        {initialCoordinate !== null && (
          <Marker longitude={initialCoordinate.lng} latitude={initialCoordinate.lat} anchor='bottom'>
            <MapPin size={36} weight='fill' className='text-accent' />
          </Marker>
        )}
        {newSelectedCoordinate !== null && (
          <Marker
            longitude={newSelectedCoordinate.lng}
            latitude={newSelectedCoordinate.lat}
            anchor='center'
          >
            <Crosshair size={36} weight='fill' className='text-accent' />
          </Marker>
        )}
        <AlertDialog
          title='Confirm Selection'
          button={<button ref={triggerButtonRef} className='hidden'>Open Dialog</button>} // Hidden button as trigger
          confirmText='Confirm'
          cancelText='Cancel'
          onConfirm={confirmSelection}
          onCancel={() => {
            setCoord((prev) => ({ initialCoordinate: prev.initialCoordinate, newSelectedCoordinate: null }))
          }}
          hideCancel={false}
          hideConfirm={false}
          hideTitle
          customPositionClasses={anchorClass}
        >
          Coordinates: {newSelectedCoordinate !== null ? `${newSelectedCoordinate.lat.toFixed(5)}, ${newSelectedCoordinate.lng.toFixed(5)}` : ''}
        </AlertDialog>
      </Map>

    </div>
  )
}

export const LazyCoordinatePickerMap = dynamic<CoordinatePickerMapProps>(async () => await import('./CoordinatePickerMap').then(
  module => module.CoordinatePickerMap), {
  ssr: false
})
