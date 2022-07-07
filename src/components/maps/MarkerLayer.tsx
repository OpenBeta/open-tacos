import { Properties, FeatureCollection } from '@turf/helpers'
import { Source, Layer, LayerProps } from 'react-map-gl'

const layerStyle: LayerProps = {
  id: 'my-areas',
  type: 'symbol',
  source: 'areas',
  filter: ['==', 'isInMyRange', true],
  layout: {
    'icon-size': ['interpolate', ['linear'], ['zoom'], 8, 1.25, 12, 1],
    'symbol-spacing': 5,
    'text-field': ['get', 'name'],
    'text-variable-anchor': ['bottom', 'left', 'right'],
    'text-radial-offset': 1,
    'text-justify': 'auto',
    'icon-image': [
      'case',
      ['boolean', ['get', 'isInMyRange'], false],
      'circle', // more important - larger marker
      'dot-11' // small marker
    ],
    'text-size': ['interpolate', ['linear'], ['zoom'], 8, 12, 14, 14],
    'icon-allow-overlap': false
  },
  paint: {
    'text-halo-blur': 4,
    'text-halo-width': 1,
    'text-color': '#ffffff',
    'text-halo-color': '#262626'
  }
}

const closeupLayerStyle: LayerProps = {
  id: 'all-markers',
  type: 'symbol',
  source: 'areas',
  minzoom: 14,
  filter: ['==', 'isInMyRange', false],
  layout: {
    'icon-size': ['interpolate', ['linear'], ['zoom'], 8, 0.75, 12, 1],
    'symbol-spacing': 20,
    'text-field': ['get', 'name'],
    'text-variable-anchor': ['bottom', 'left', 'right'],
    'text-radial-offset': 1,
    'text-justify': 'auto',
    'icon-image': 'dot-11',
    'text-size': ['interpolate', ['linear'], ['zoom'], 8, 12, 14, 10],
    'icon-allow-overlap': false
  },
  paint: {
    'icon-color': '#ffffff',
    'text-halo-blur': 4,
    'text-halo-width': 2,
    'text-color': '#a3a3a3',
    'text-halo-color': '#334455'
  }
}

const closeupLayerStyleBright: LayerProps = {
  ...closeupLayerStyle,
  id: 'all-markers-bright',
  minzoom: 11,
  filter: ['==', 'leaf', true],
  layout: {
    ...closeupLayerStyle.layout,
    'text-size': ['interpolate', ['linear'], ['zoom'], 8, 14, 14, 15]
  },
  paint: {
    'icon-color': '#ffffff',
    'text-halo-blur': 4,
    'text-halo-width': 4,
    'text-color': '#000000',
    'text-halo-color': '#eaeaea'
  }
}

const largeAreaLayerStyleBright: LayerProps = {
  ...closeupLayerStyle,
  id: 'area-markers-bright',
  minzoom: 8,
  maxzoom: 14,
  filter: ['all', ['!=', 'leaf', true], ['>', 'totalClimbs', 30], ['<', 'totalClimbs', 500], ['>', 'density', 0.35]],
  layout: {
    ...closeupLayerStyle.layout,
    'text-size': ['interpolate', ['linear'], ['zoom'], 8, 14, 14, 15]
  },
  paint: {
    'icon-color': '#ffffff',
    'text-halo-blur': 4,
    'text-halo-width': 4,
    'text-color': '#000000',
    'text-halo-color': '#eaeaea'
  }
}

const destinationLayerStyleBright: LayerProps = {
  ...closeupLayerStyle,
  id: 'destination-markers-bright',
  minzoom: 5,
  maxzoom: 8,
  filter: ['all', ['!=', 'leaf', true], ['>=', 'totalClimbs', 300], ['>', 'density', 0.5]],
  layout: {
    ...closeupLayerStyle.layout,
    'text-size': ['interpolate', ['linear'], ['zoom'], 8, 14, 14, 15]
  },
  paint: {
    'icon-color': '#ffffff',
    'text-halo-blur': 4,
    'text-halo-width': 4,
    'text-color': '#000000',
    'text-halo-color': '#eaeaea'
  }
}

interface MarkerLayerProps {
  geojson: FeatureCollection<GeoJSON.Geometry, Properties> | undefined
}

/**
 * Build a layer of crag markers using native Mapbox GL style.
 */
export default function MarkerLayer ({ geojson }: MarkerLayerProps): JSX.Element | null {
  if (geojson == null) return null
  return (
    <Source
      id='areas'
      type='geojson'
      data={geojson}
    >
      <Layer {...closeupLayerStyle} />
      <Layer {...layerStyle} />
    </Source>
  )
}

export function MarkerLayer2 ({ geojson }: MarkerLayerProps): JSX.Element | null {
  if (geojson == null) return null
  return (
    <Source
      id='areas'
      type='geojson'
      data={geojson}
    >
      <Layer {...destinationLayerStyleBright} />
      <Layer {...largeAreaLayerStyleBright} />
      <Layer {...closeupLayerStyleBright} />
    </Source>
  )
}

// Important! Pass these IDs to Mapbox GL so that onClick/onHover receives
// the active Geojson object
export const InteractiveLayerIDs = [layerStyle.id, closeupLayerStyle.id]
