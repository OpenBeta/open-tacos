import { Source, Layer } from 'react-map-gl'

/**
 * OpenBeta custom map tiles
 * @returns
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
        /**
         * Can be any unique id.  In order for the mouse to interact with the layer,
         * the id must be specified in ReactMapGL's interactiveLayerIds prop
         */
        id='crags'
        type='symbol'
        source-layer='crags' // source-layer is the layer name in the vector tileset
        layout={{
          'text-field': ['get', 'name'],
          'text-size': 12,
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
          'icon-image': 'circle',
          'icon-size': ['interpolate', ['linear'], ['zoom'], 8, 0.25, 16, 1],
          'text-variable-anchor': ['bottom', 'left', 'right'],
          'text-radial-offset': 0.5
        }}
        paint={{
          'icon-color': '#111827',
          'text-halo-blur': 1,
          'text-halo-width': 1,
          'text-color': '#111827',
          'text-halo-color': '#f8fafc'
        }}
      />
    </Source>
  )
}
