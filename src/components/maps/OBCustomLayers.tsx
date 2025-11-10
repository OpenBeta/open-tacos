import { Source, Layer } from 'react-map-gl'
import { DataLayersDisplayState } from '@/components/maps/GlobalMap'
import { type MapStyles } from '@/components/maps/MapSelector'

interface OBCustomLayersProps {
  layersState: DataLayersDisplayState
  mapType: keyof MapStyles
}
/**
 * OpenBeta custom map tiles.
 * - Crags: crag markers and labels
 * - Areas: polygon boundaries for areas
 */
export const OBCustomLayers: React.FC<OBCustomLayersProps> = ({ layersState, mapType }) => {
  const { areaBoundaries, crags } = layersState

  // Use high-contrast white text on dark/satellite maps
  const isDarkMap = mapType === 'dark' || mapType === 'satellite'

  return (
    <>
      <Source
        id='areas' // can be any unique id
        type='vector'
        tiles={[
          'https://maptiles.openbeta.io/areas/{z}/{x}/{y}.pbf'
        ]}
        promoteId='id'
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
              '#004F6E'
            ],
            'line-width': { stops: [[6, 2], [6.1, 4]] },
            'line-blur': 4,
            'line-opacity': 0.8

          }}
          layout={{
            visibility: areaBoundaries ? 'visible' : 'none'
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
            visibility: areaBoundaries ? 'visible' : 'none'
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
          id='crag-markers' // can be any unique id. Must match the id in ReactMapGL.interactiveLayerIds
          type='circle'
          source-layer='crags' // layer name in the vector tileset
          paint={{
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 6, 3, 18, 8],
            'circle-color': ['match', ['string', ['get', 'media']], ['[]'], '#0c4a6e', '#881337'],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff'
          }}
          layout={{
            visibility: crags ? 'visible' : 'none'
          }}
        />
        <Layer
          id='crag-name-labels' // can be any unique id. Must match the id in ReactMapGL.interactiveLayerIds
          type='symbol'
          source-layer='crags' // layer name in the vector tileset
          layout={{
            'text-field': ['coalesce', ['get', 'name'], ['get', 'areaName']],
            'text-size': [
              'interpolate',
              ['linear'],
              ['zoom'],
              8,
              ['case',
                ['<', ['length', ['get', 'ancestors']], 120], 19,
                ['<', ['length', ['get', 'ancestors']], 200], 16,
                ['<', ['length', ['get', 'ancestors']], 300], 14,
                11
              ],
              12,
              ['case',
                ['<', ['length', ['get', 'ancestors']], 120], 21,
                ['<', ['length', ['get', 'ancestors']], 200], 20,
                ['<', ['length', ['get', 'ancestors']], 300], 16,
                14
              ]
            ],
            'text-font': ['Noto Sans Regular'],
            'text-variable-anchor': ['bottom', 'top', 'left', 'right'],
            'text-radial-offset': ['interpolate', ['linear'], ['zoom'], 16, 0.5],
            'text-optional': true,
            'symbol-sort-key': ['length', ['get', 'ancestors']],
            visibility: crags ? 'visible' : 'none'
          }}
          paint={isDarkMap
            ? {
                'text-halo-blur': 0.5,
                'text-halo-width': 2,
                'text-color': '#ffffff',
                'text-halo-color': '#1a1a1a'
              }
            : mapType === 'light'
              ? {
                  'text-halo-blur': 0.5,
                  'text-halo-width': 2.5,
                  'text-color': ['match', ['string', ['get', 'media']], ['[]'], '#1e40af', '#be123c'],
                  'text-halo-color': '#ffffff'
                }
              : {
                  'text-halo-blur': 0.5,
                  'text-halo-width': 2,
                  'text-color': ['match', ['string', ['get', 'media']], ['[]'], '#0c4a6e', '#881337'],
                  'text-halo-color': '#ffffff'
                }}
        />
      </Source>
    </>
  )
}
