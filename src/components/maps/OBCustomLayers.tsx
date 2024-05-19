import { Source, Layer } from 'react-map-gl'
import { DataLayersDisplayState } from './GlobalMap'

interface OBCustomLayersProps {
  layersState: DataLayersDisplayState
}
/**
 * OpenBeta custom map tiles.
 * - Crags: crag markers and labels
 * - Crag groups: polygon boundaries for crag groups (TBD)
 */
export const OBCustomLayers: React.FC<OBCustomLayersProps> = ({ layersState }) => {
  const { cragGroups } = layersState
  return (
    <>
      <Source
        id='crags-source2' // can be any unique id
        type='vector'
        tiles={[
          'https://maptiles.openbeta.io/crag-groups/{z}/{x}/{y}.pbf'
        ]}
        maxzoom={8}
        attribution='© OpenBeta contributors'
      >

        <Layer
          id='crag-group-boundaries' // can be any unique id. Must match the id in ReactMapGL.interactiveLayerIds
          type='line'
          source-layer='crag-groups' // source-layer is the layer name in the vector tileset
          paint={{
            'line-color': '#ec407a',
            'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1, 19, 4],
            'line-opacity': 0.8
          }}
          layout={{
            visibility: cragGroups ? 'visible' : 'none'
          }}
        />
      </Source>
      <Source
        id='crags-source1' // can be any unique id
        type='vector'
        tiles={[
          'https://maptiles.openbeta.io/crags/{z}/{x}/{y}.pbf'
        ]}
        maxzoom={11}
        attribution='© OpenBeta contributors'
      >
        <Layer
          id='crag-markers' // can be any unique id. Must match the id in ReactMapGL.interactiveLayerIds
          type='circle'
          source-layer='crags' // source-layer is the layer name in the vector tileset
          paint={{
            'circle-radius': { stops: [[8, 2], [18, 4]] },
            'circle-color': '#ff6e40',
            'circle-blur': 0.2,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#546e7a',
            'circle-stroke-opacity': 0.8
          }}
          minzoom={6}
        />
        <Layer
          id='crag-name-labels' // can be any unique id. Must match the id in ReactMapGL.interactiveLayerIds
          type='symbol'
          source-layer='crags' // source-layer is the layer name in the vector tileset
          layout={{
            'icon-anchor': 'center',
            'text-field': ['get', 'name'],
            'text-size': { stops: [[8, 10], [12, 12]] },
            'text-font': ['Segoe UI', 'Roboto', 'Ubuntu', 'Helvetica Neue', 'Oxygen', 'Cantarell', 'sans-serif'],
            'text-variable-anchor': ['bottom', 'top', 'left', 'right'],
            'text-radial-offset': ['interpolate', ['linear'], ['zoom'], 16, 0.5],
            'text-optional': true,
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
    </>
  )
}
