import React from 'react'
import DeckGL from '@deck.gl/react'
import { Map, useMap } from 'react-map-gl'

export const DEFAULT_INITIAL_VIEWSTATE = {
  width: 300,
  height: 600,
  padding: 10,
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

const BaseMap = ({
  layers,
  disableController = false,
  viewstate,
  initialViewState,
  onViewStateChange,
  getTooltip = null,
  children = null,
  light = true,
  onClick,
  onHover
}) => {
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
      interactiveLayerIds={['area-labels']}
      onMove={onViewStateChange}
      interactive
    >
      {children}
    </Map>
  )
}

export default BaseMap
