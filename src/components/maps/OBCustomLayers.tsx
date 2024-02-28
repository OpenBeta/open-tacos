import { Source, Layer } from 'react-map-gl'

/**
 * OpenBeta custom map tiles.
 * - Crags: crag markers and labels
 * - Crag groups: polygon boundaries for crag groups (TBD)
 */
export const OBCustomLayers: React.FC = () => {
  return (
    <Source
      id='crags-source' // can be any unique id
      type='vector'
      tiles={[
        'https://maptiles.openbeta.io/crags/{z}/{x}/{y}.pbf'
      ]}
      attribution='© OpenBeta contributors'
    >
      <Layer
        id='crags' // can be any unique id. Must match the id in ReactMapGL.interactiveLayerIds
        type='symbol'
        source-layer='crags' // source-layer is the layer name in the vector tileset
        layout={{
          'icon-anchor': 'center',
          'text-field': ['get', 'name'],
          'text-size': 12,
          'text-font': ['Segoe UI', 'Roboto', 'Ubuntu', 'Helvetica Neue', 'Oxygen', 'Cantarell', 'sans-serif'],
          'icon-image': 'circle-dot',
          'icon-size': ['interpolate', ['linear'], ['zoom'], 8, 0.5, 18, 1],
          'text-variable-anchor': ['bottom', 'top', 'left', 'right'],
          'text-radial-offset': ['interpolate', ['linear'], ['zoom'], 6, 0.25, 16, 1],
          'text-optional': true,
          'icon-padding': 8,
          'symbol-sort-key': ['match', ['string', ['get', 'media']], ['[]'], 1, 0]
        }}
        paint={{
          'icon-color': ['match', ['string', ['get', 'media']], ['[]'], '#111827', '#881337'],
          'text-halo-blur': 1,
          'text-halo-width': 2,
          'text-color': ['match', ['string', ['get', 'media']], ['[]'], '#111827', '#881337'],
          'text-halo-color': '#f8fafc'
        }}
      />
    </Source>
  )
}
