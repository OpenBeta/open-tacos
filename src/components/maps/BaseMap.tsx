import React, { useEffect, useRef } from 'react'
import { Map, MapLayerMouseEvent, ViewState, MapRef } from 'react-map-gl'
import { XViewStateType } from '../../js/types'

export const DEFAULT_INITIAL_VIEWSTATE: XViewStateType = {
  width: 300,
  height: 600,
  padding: { top: 5, bottom: 5, left: 5, right: 5 },
  bearing: 0,
  zoom: 8,
  pitch: 0,
  latitude: 44.968,
  longitude: -103.77154,
  bbox: [0, 0, 0, 0]
}

export const MAP_STYLES = {
  light: 'mapbox://styles/mappandas/ckx5ksor56x3z15qavm57edp9',
  dark: 'mapbox://styles/mappandas/cl0u44wo8008415pedsbgtml7'
}

interface BaseMapProps {
  height: number
  viewstate: ViewState
  onViewStateChange: (vs: XViewStateType) => void
  children: JSX.Element | JSX.Element[]
  light: boolean
  onClick?: (event: MapLayerMouseEvent) => void
  onHover?: (event: MapLayerMouseEvent) => void
  interactiveLayerIds: string[]
}

/**
 * Important! if you want MapGL to pass custom layer data to onClick/onHover,
 * you need to provide the layer id to MapGL via interactiveLayerIds
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

  const onMoveHandler = ({ viewState }): void => {
    const bounds = mapRef.current?.getBounds() ?? null

    let bbox = [0, 0, 0, 0]
    if (bounds != null) {
      const sw = bounds.getSouthWest()
      const ne = bounds.getNorthEast()
      bbox = [sw.lng, sw.lat, ne.lng, ne.lat]
    }
    onViewStateChange({ ...viewState, bbox })
  }

  return (
    <Map
      {...viewstate}
      id='areaHeatmap'
      reuseMaps
      mapStyle={light ? MAP_STYLES.light : MAP_STYLES.dark}
      mapboxAccessToken='pk.eyJ1IjoibWFwcGFuZGFzIiwiYSI6ImNqcDdzbW12aTBvOHAzcW82MGg0ZTRrd3MifQ.MYiNJHklgMkRzapAKuTQNg'
      onMouseMove={onHover}
      onClick={onClick}
      interactiveLayerIds={interactiveLayerIds}
      onMove={onMoveHandler}
      interactive
      style={{ height: height }}
      ref={mapRef}
    >
      {children}
    </Map>
  )
}
