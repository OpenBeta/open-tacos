import React, { useRef, useEffect } from 'react'
import { Map, MapLayerMouseEvent, MapRef, ViewStateChangeEvent } from 'react-map-gl'

import { BBoxType, XViewStateType } from '../../js/types'

export const DEFAULT_INITIAL_VIEWSTATE: XViewStateType = {
  width: 300,
  height: 1024,
  padding: { top: 20, bottom: 20, left: 20, right: 20 },
  bearing: 0,
  zoom: 9,
  pitch: 0,
  latitude: 36.079693291728546,
  longitude: -115.5,
  bbox: [0, 0, 0, 0]
}

export const MAP_STYLES = {
  light: 'mapbox://styles/mappandas/ckf8bb0qv18be19npofybx7yq',
  dark: 'mapbox://styles/mappandas/cl0u44wo8008415pedsbgtml7'
}
interface BaseMapProps {
  height: number
  viewstate: XViewStateType
  onViewStateChange: (vs: XViewStateType) => void
  children: JSX.Element | JSX.Element[] | null
  light: boolean
  onClick?: (event: MapLayerMouseEvent) => void
  onHover?: (event: MapLayerMouseEvent) => void
  interactiveLayerIds: string[]
}

/**
 * Important! if you want MapGL to pass custom layer data to onClick/onHover,
 * you need to provide the layer id to MapGL via interactiveLayerIds
 * @deprecated
 */
export default function BaseMap ({
  height,
  viewstate,
  onViewStateChange,
  children,
  light,
  onClick = (): void => {},
  onHover = (): void => {},
  interactiveLayerIds
}: BaseMapProps): JSX.Element {
  const mapRef = useRef<MapRef>(null)

  // Map seems to struggle responding to height changes after initial set
  useEffect(() => {
    if (mapRef.current !== null) {
      const map = (mapRef.current)
      map.resize()
    }
  }, [height, mapRef])

  const onMapLoad = React.useCallback(() => {
    if (mapRef.current !== null) {
      const map = mapRef.current

      const bounds = map.getBounds()
      const sw = bounds.getSouthWest()
      const ne = bounds.getNorthEast()
      const bbox: BBoxType = [sw.lng, sw.lat, ne.lng, ne.lat]

      const center = map.getCenter()
      const vs = {
        bearing: 0,
        zoom: map.getZoom(),
        padding: map.getPadding(),
        pitch: 0,
        latitude: center.lat,
        longitude: center.lng,
        bbox
      }
      onViewStateChange({ ...viewstate, ...vs, bbox })
    }
  }, [viewstate])

  const onMoveHandler = (event: ViewStateChangeEvent): void => {
    // console.log(event)
    const { viewState } = event
    const bounds = mapRef.current?.getBounds() ?? null

    let bbox: BBoxType = [0, 0, 0, 0]
    if (bounds != null) {
      const sw = bounds.getSouthWest()
      const ne = bounds.getNorthEast()
      bbox = [sw.lng, sw.lat, ne.lng, ne.lat]
    }
    onViewStateChange({ ...viewState, height: 0, width: 0, bbox })
  }

  return (
    <Map
      {...viewstate}
      id='areaHeatmap'
      reuseMaps
      mapStyle={light ? MAP_STYLES.light : MAP_STYLES.dark}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      onMouseMove={onHover}
      onClick={onClick}
      interactiveLayerIds={interactiveLayerIds}
      onMove={onMoveHandler}
      onLoad={onMapLoad}
      interactive
      style={{ height }}
      ref={mapRef}
    >
      {children}
    </Map>
  )
}
