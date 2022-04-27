import React from 'react'
import { Map, MapLayerMouseEvent, ViewStateChangeEvent, ViewState } from 'react-map-gl'

export const DEFAULT_INITIAL_VIEWSTATE = {
  width: 300,
  height: 600,
  padding: { top: 5, bottom: 5, left: 5, right: 5 },
  bearing: 0,
  zoom: 8,
  pitch: 0,
  latitude: 44.968,
  longitude: -103.77154
}

const MAP_STYLES = {
  light: 'mapbox://styles/mappandas/ckx5ksor56x3z15qavm57edp9',
  dark: 'mapbox://styles/mappandas/cl0u44wo8008415pedsbgtml7'
}

interface BaseMapProps {
  viewstate: ViewState & {
    width: number
    height: number
  }
  initialViewState: ViewState & {
    width: number
    height: number
  }
  onViewStateChange: (event: ViewStateChangeEvent) => void
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
  viewstate,
  initialViewState,
  onViewStateChange,
  children,
  light,
  onClick = (): void => {},
  onHover = (): void => {},
  interactiveLayerIds
}: BaseMapProps): JSX.Element {
  return (
    <Map
      id='areaHeatmap'
      initialViewState={initialViewState}
      viewState={viewstate}
      reuseMaps
      mapStyle={light ? MAP_STYLES.light : MAP_STYLES.dark}
      mapboxAccessToken='pk.eyJ1IjoibWFwcGFuZGFzIiwiYSI6ImNqcDdzbW12aTBvOHAzcW82MGg0ZTRrd3MifQ.MYiNJHklgMkRzapAKuTQNg'
      onMouseMove={onHover}
      onClick={onClick}
      interactiveLayerIds={interactiveLayerIds}
      onMove={onViewStateChange}
      interactive
    >
      {children}
    </Map>
  )
}
