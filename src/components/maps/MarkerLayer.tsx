import { Properties, FeatureCollection } from '@turf/helpers'
import { Source, Layer, LayerProps } from 'react-map-gl'

export const LayerId = 'area-labels'

const layerStyle: LayerProps = {
  id: LayerId,
  type: 'symbol',
  source: 'areas',
  layout: {
    'icon-size': ['interpolate', ['linear'], ['zoom'], 8, 1.25, 12, 1],
    'symbol-spacing': 5,
    'text-field': ['get', 'name'],
    'text-variable-anchor': ['bottom', 'left', 'right'],
    'text-radial-offset': 1,
    'text-justify': 'auto',
    'icon-image': 'circle',
    'text-size': ['interpolate', ['linear'], ['zoom'], 8, 14, 14, 12],
    'icon-allow-overlap': true
  },
  paint: {
    'text-halo-blur': 4,
    'text-halo-width': 2,
    'text-color': '#ffffff',
    'text-halo-color': '#334455'
  }
}

interface MarkerLayerProps {
  geojson: FeatureCollection<GeoJSON.Geometry, Properties>
}

/**
 * Build a layer of crag markers using native Mapbox GL style.
 */
export default function MarkerLayer ({ geojson }: MarkerLayerProps): JSX.Element {
  return (
    <Source
      id='areas'
      type='geojson'
      data={geojson}
    >
      <Layer id='crag-markers' {...layerStyle} />
    </Source>
  )
}
