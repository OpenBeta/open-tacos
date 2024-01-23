'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Map, ScaleControl, FullscreenControl, NavigationControl, MapLayerMouseEvent, MapInstance } from 'react-map-gl'
import { Point, Polygon } from '@turf/helpers'

import { MAP_STYLES } from './BaseMap'
import { AreaInfoDrawer } from './AreaInfoDrawer'
import { AreaInfoHover } from './AreaInfoHover'
import { SelectedFeature } from './AreaActiveMarker'

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

interface GlobalMapProps {
  showFullscreenControl?: boolean
}
/**
 * Global map
 */
export const GlobalMap: React.FC<GlobalMapProps> = ({ showFullscreenControl = true }) => {
  const [defaultCenter, setDefaultCenter] = useState<{ longitude: number, latitude: number } | null >(null)
  const [clickInfo, setClickInfo] = useState<MapAreaFeatureProperties | null>(null)
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null)
  const [selected, setSelected] = useState<Point | Polygon | null>(null)
  const [mapInstance, setMapInstance] = useState<MapInstance | null>(null)
  const [cursor, setCursor] = useState<string>('default')
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (mapRef.current != null) {
      setMapInstance(mapRef.current)
    }
  }, [mapRef?.current])

  useEffect(() => {
    const fetchDefaultCenter = async (): Promise<void> => {
      const res = await fetch('/api/geo')
      if (res.ok) {
        res.json().then(({ longitude, latitude }) => {
          setDefaultCenter({ longitude, latitude })
        }).catch((err) => {
          console.error(err)
        })
      }
    }
    void fetchDefaultCenter()
  }, [])

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
        id='global-map'
        {...(defaultCenter != null ? { ...defaultCenter, zoom: 3 } : {})}
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
        cooperativeGestures={showFullscreenControl}
        interactiveLayerIds={['crags', 'crag-group-boundaries']}
      >
        <ScaleControl />
        {showFullscreenControl && <FullscreenControl />}
        <NavigationControl showCompass={false} position='bottom-right' />
        {selected != null &&
          <SelectedFeature geometry={selected} />}
        <AreaInfoDrawer data={clickInfo} />
        {hoverInfo != null && <AreaInfoHover {...hoverInfo} />}
      </Map>
    </div>
  )
}
