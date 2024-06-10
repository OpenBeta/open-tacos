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

// Important! Pass these IDs to Mapbox GL so that onClick/onHover receives
// the active Geojson object
export const InteractiveLayerIDs = [layerStyle.id, closeupLayerStyle.id] as string[]
