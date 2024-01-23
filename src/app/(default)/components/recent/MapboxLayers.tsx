import { Properties, FeatureCollection } from '@turf/helpers'
import { Source, Layer, LayerProps } from 'react-map-gl'

export const labelLayer: LayerProps = {
  id: 'recent-edits',
  type: 'symbol',
  source: 'history',
  minzoom: 13,
  layout: {
    'text-field': ['get', 'name'],
    'text-variable-anchor': ['bottom', 'left', 'right'],
    'text-radial-offset': 1,
    'text-justify': 'auto',
    'text-size': ['interpolate', ['linear'], ['zoom'], 8, 12, 14, 14],
    'icon-image': 'circle'
  },
  paint: {
    'text-halo-blur': 4,
    'text-halo-width': 1,
    'text-color': '#ffffff',
    'text-halo-color': '#262626'
  }
}

export const clusterLayer: LayerProps = {
  id: 'clusters',
  type: 'circle',
  source: 'areas',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 5, '#f1f075', 50, '#f28cb1'],
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
  }
}

export const UnclusteredSource: React.FC<{ geojson: FeatureCollection<GeoJSON.Geometry, Properties> }> = ({ geojson }) => {
  if (geojson == null) return null
  return (
    <Source
      id='history'
      type='geojson'
      data={geojson}
    >
      <Layer {...labelLayer} />
    </Source>
  )
}

export const RecentEditsLayer: React.FC<{ geojson: FeatureCollection<GeoJSON.Geometry, Properties> } > = ({ geojson }) => {
  if (geojson == null) return null
  return (
    <Source
      id='areas'
      type='geojson'
      data={geojson}
      cluster
      clusterMinPoints={2}
      clusterMaxZoom={12}
      clusterRadius={50}
    >
      <Layer {...clusterLayer} />
      <Layer {...clusterCountLayer} />
    </Source>
  )
}

export const clusterCountLayer: LayerProps = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'areas',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-size': 12
  }
}
