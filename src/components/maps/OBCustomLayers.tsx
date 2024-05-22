import { Source, Layer } from 'react-map-gl'
import { DataLayersDisplayState } from './GlobalMap'

interface OBCustomLayersProps {
  layersState: DataLayersDisplayState
}
/**
 * OpenBeta custom map tiles.
 * - Crags: crag markers and labels
 * - Areas: polygon boundaries for areas
 */
export const OBCustomLayers: React.FC<OBCustomLayersProps> = ({ layersState }) => {
  const { cragGroups } = layersState
  return (
    <>
      <Source
        id='areas' // can be any unique id
        type='vector'
        tiles={[
          'https://maptiles.openbeta.io/areas/{z}/{x}/{y}.pbf'
        ]}
        promoteId='uuid'
        maxzoom={8}
        attribution='© OpenBeta contributors'
      >
        <Layer
          id='area-boundaries' // can be any unique id. Must match the id in ReactMapGL.interactiveLayerIds
          type='line'
          source-layer='areas' // layer name in the vector tileset
          paint={{
            'line-color': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              '#ec407a',
              '#6366f1'
            ],
            'line-width': { stops: [[6, 0.5], [8, 4]] },
            'line-opacity': 0.65,
            'line-dasharray': [2, 0.5]

          }}
          layout={{
            visibility: cragGroups ? 'visible' : 'none'
          }}
        />
        <Layer
          id='area-background' // can be any unique id. Must match the id in ReactMapGL.interactiveLayerIds
          type='fill'
          source-layer='areas' // layer name in the vector tileset
          paint={{
            'fill-color': '#6366f1',
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'selected'], false],
              0.2,
              0
            ]
          }}
          layout={{
            visibility: cragGroups ? 'visible' : 'none'
          }}
        />
      </Source>
      <Source
        id='crags' // can be any unique id
        type='vector'
        tiles={[
          'https://maptiles.openbeta.io/crags/{z}/{x}/{y}.pbf'
        ]}
        promoteId='id'
        maxzoom={11}
        attribution='© OpenBeta contributors'
      >
        <Layer
          id='crag-name-labels' // can be any unique id. Must match the id in ReactMapGL.interactiveLayerIds
          type='symbol'
          source-layer='crags' // layer name in the vector tileset
          layout={{
            'icon-anchor': 'center',
            'text-field': ['get', 'name'],
            'text-size': { stops: [[8, 10], [12, 12]] },
            'text-font': ['Segoe UI', 'Roboto', 'Ubuntu', 'Helvetica Neue', 'Oxygen', 'Cantarell', 'sans-serif'],
            'text-variable-anchor': ['bottom', 'top', 'left', 'right'],
            'text-radial-offset': ['interpolate', ['linear'], ['zoom'], 16, 0.5],
            'text-optional': true,
            'symbol-sort-key': ['match', ['string', ['get', 'media']], ['[]'], 1, 0],
            'icon-image': 'circle-dot',
            'icon-size': ['interpolate', ['linear'], ['zoom'], 6, 0.5, 18, 1]
          }}
          paint={{
            'icon-color': ['match', ['string', ['get', 'media']], ['[]'], '#0c4a6e', '#881337'],
            'text-halo-blur': 1,
            'text-halo-width': 2,
            'text-color': ['match', ['string', ['get', 'media']], ['[]'], '#0c4a6e', '#881337'],
            'text-halo-color': '#f3f4f6'
          }}
        />
      </Source>
    </>
  )
}
