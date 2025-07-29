'use client'
import { useCallback, useEffect, useState } from 'react'
import { Map, FullscreenControl, ScaleControl, NavigationControl, MapLayerMouseEvent, ViewStateChangeEvent, GeolocateControl } from 'react-map-gl/maplibre'
import * as maplibregl from 'maplibre-gl'
import { MapLibreEvent } from 'maplibre-gl'
import dynamic from 'next/dynamic'
import { MAP_STYLES, type MapStyles } from './MapSelector'
import { Drawer } from './TileHandlers/Drawer'
import { HoverCard } from './TileHandlers/HoverCard'
import { OBCustomLayers } from './OBCustomLayers'
import { tileToFeature } from './utils'
import { ActiveFeature, TileProps } from './TileTypes'
import MapLayersSelector from './MapLayersSelector'
import { MapToolbar } from './MapToolbar'
import { SelectedFeature } from './AreaActiveMarker'
import { useRouter } from 'next/navigation'
import { useUrlParams } from '@/js/hooks/useUrlParams'

export interface CameraInfo {
  center: {
    lng: number
    lat: number
  }
  zoom: number
}

interface FeatureState {
  selected?: boolean
  hover?: boolean
}

export interface DataLayersDisplayState {
  areaBoundaries: boolean
  organizations: boolean
  heatmap: boolean
  crags: boolean
}

interface GlobalMapProps {
  showFullscreenControl?: boolean
  initialCenter?: [number, number]
  initialZoom?: number
  initialViewState?: {
    bounds: maplibregl.LngLatBoundsLike
    fitBoundsOptions?: maplibregl.FitBoundsOptions
  }
  onCameraMovement?: (camera: CameraInfo) => void
  children?: React.ReactNode
  handleOnClick?: (e: MapLayerMouseEvent) => void
  initialAreaId?: string
}

/**
 * Global map
 */
export const GlobalMap: React.FC<GlobalMapProps> = ({
  showFullscreenControl = true, initialCenter, initialZoom, initialViewState, onCameraMovement, children, handleOnClick, initialAreaId
}) => {
  const [clickInfo, setClickInfo] = useState<ActiveFeature | null>(null)
  const [hoverInfo, setHoverInfo] = useState<ActiveFeature | null>(null)
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null)
  const [cursor, setCursor] = useState<string>('default')
  const [mapStyle, setMapStyle] = useState<string>(MAP_STYLES.light.style)
  const [isSourceLoaded, setIsSourceLoaded] = useState(false)
  const [dataLayersDisplayState, setDataLayersDisplayState] = useState<DataLayersDisplayState>({
    areaBoundaries: false,
    organizations: false,
    heatmap: false,
    crags: true
  })
  const router = useRouter()
  const urlParams = useUrlParams()

  const setActiveFeatureVisual = (feature: ActiveFeature | null, fState: FeatureState): void => {
    if (feature == null || mapInstance == null) return
    mapInstance.setFeatureState({
      source: 'areas',
      sourceLayer: 'areas',
      id: feature.data.id
    }, fState)
  }

  const onMoveEnd = useCallback((e: ViewStateChangeEvent) => {
    if ((mapInstance == null) || e.viewState == null || (onCameraMovement === undefined)) return
    onCameraMovement({
      center: {
        lat: e.viewState.latitude,
        lng: e.viewState.longitude
      },
      zoom: e.viewState.zoom
    })
  }, [mapInstance, onCameraMovement])

  const onLoad = useCallback((e: MapLibreEvent) => {
    if (e.target == null) return
    setMapInstance(e.target)

    // Only apply jumpTo if initial values are defined
    if (initialCenter != null && initialZoom != null) {
      e.target.jumpTo({ center: initialCenter, zoom: initialZoom ?? 6 })
    } else if (initialViewState != null) {
      e.target.fitBounds(initialViewState.bounds, initialViewState.fitBoundsOptions)
    }
  }, [initialCenter, initialZoom, initialViewState])

  /**
   * Handle click event on the map. Place a marker on the map and activate the side drawer.
   */
  const onClick = (event: MapLayerMouseEvent): void => {
    if (mapInstance == null) return
    const feature = event?.features?.[0]
    handleOnClick?.(event)
    if (feature === undefined) {
      setClickInfo(null)
    } else {
      const { layer, geometry, properties } = feature
      setClickInfo(prev => {
        setActiveFeatureVisual(prev, { selected: false, hover: false })
        const activeFeature = tileToFeature(layer.id, event.point, geometry, properties as TileProps, mapInstance)
        setActiveFeatureVisual(activeFeature, { selected: true, hover: false })
        return activeFeature
      })
    }
  }

  /**
   * Handle click event on the popover. Behave as if the user clicked on a feature on the map.
   */
  const onHoverCardClick = (feature: ActiveFeature): void => {
    const areaId = feature.data?.id
    if (areaId === '') {
      return
    }

    const { camera } = urlParams.fromUrl()
    const url = urlParams.toUrl({ camera: camera ?? null, areaId })
    router.replace(url, { scroll: false })
    setClickInfo(prevFeature => {
      setHoverInfo(null)
      setActiveFeatureVisual(prevFeature, { selected: false, hover: false })
      if (feature.type === 'area-boundaries') {
        setActiveFeatureVisual(feature, { selected: true, hover: false })
      }
      return feature
    })
  }

  /**
   * Handle mouseover event on the map. Show the popover with the area info.
   */
  const onHover = (event: MapLayerMouseEvent): void => {
    const obLayerId = event.features?.findIndex((f) =>
      f.layer.id === 'crag-markers' ||
      f.layer.id === 'crag-name-labels' ||
      f.layer.id === 'area-boundaries' ||
      f.layer.id === 'area-background'
    ) ?? -1

    if (obLayerId !== -1) {
      setCursor('pointer')
      const feature = event.features?.[obLayerId]

      if (feature != null && mapInstance != null) {
        const { layer, geometry, properties } = feature
        setHoverInfo(prev => {
          setActiveFeatureVisual(prev, { hover: false })
          const feat = tileToFeature(layer.id, event.point, geometry, properties as TileProps, mapInstance)
          setActiveFeatureVisual(feat, { hover: true })
          return feat
        })
      }
    } else {
      setHoverInfo(null)
      setCursor('default')
    }
  }

  const updateMapLayer = (key: keyof MapStyles): void => {
    const style = MAP_STYLES[key]
    setMapStyle(style.style)
  }

  const findAreaById = useCallback((map: maplibregl.Map, areaId: string) => {
    const features = map.querySourceFeatures('crags', {
      sourceLayer: 'crags',
      filter: ['==', ['get', 'id'], areaId]
    })
    return features[0] // return first feature because it could be duplicated by the tileset
  }, [])

  useEffect(() => {
    if (mapInstance == null) return

    if (!isSourceLoaded) {
      mapInstance.on('sourcedata', (e) => {
        if (e.sourceId === 'crags' && e.isSourceLoaded) {
          setIsSourceLoaded(true)
        }
      })
    }

    if (isSourceLoaded && initialAreaId !== undefined) {
      const feature = findAreaById(mapInstance, initialAreaId)
      if (feature != null) {
        setClickInfo(prev => {
          setActiveFeatureVisual(prev, { selected: false, hover: false })

          const activeFeature = tileToFeature('crag-name-labels', { x: 0, y: 0 }, feature.geometry, feature.properties as TileProps, mapInstance)
          setActiveFeatureVisual(activeFeature, { selected: true, hover: false })
          return activeFeature
        })
      }
    }
  }, [mapInstance, isSourceLoaded, initialAreaId, findAreaById])

  return (
    <div className='relative w-full h-full'>
      <Map
        id='global-map'
        onLoad={onLoad}
        onDragStart={() => setCursor('move')}
        onMoveEnd={onMoveEnd}
        onDragEnd={() => setCursor('default')}
        onMouseEnter={onHover}
        onMouseLeave={() => {
          setHoverInfo(prev => {
            setActiveFeatureVisual(prev, { hover: false })
            return null
          })
          setCursor('default')
        }}
        onClick={onClick}
        mapStyle={mapStyle}
        cursor={cursor}
        cooperativeGestures={showFullscreenControl}
        interactiveLayerIds={['crag-markers', 'crag-name-labels', 'area-boundaries', 'organizations']}
      >
        <MapToolbar layerState={dataLayersDisplayState} onChange={setDataLayersDisplayState} />
        <MapLayersSelector emit={updateMapLayer} />
        <ScaleControl unit='imperial' style={{ marginBottom: 10 }} position='bottom-left' />
        <ScaleControl unit='metric' style={{ marginBottom: 0 }} position='bottom-left' />
        <OBCustomLayers layersState={dataLayersDisplayState} />
        {showFullscreenControl && <FullscreenControl />}
        <NavigationControl showCompass={false} position='bottom-right' />
        <GeolocateControl
          position='bottom-right'
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation
        />
        {clickInfo != null && <SelectedFeature feature={clickInfo} />}
        <Drawer feature={clickInfo} />
        {hoverInfo != null && (
          <HoverCard {...hoverInfo} onClick={onHoverCardClick} />
        )}
        {children}
      </Map>
    </div>
  )
}

export const LazyGlobalMap = dynamic<GlobalMapProps>(async () => await import('./GlobalMap').then(
  module => module.GlobalMap), {
  ssr: false
})
