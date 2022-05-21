import { Source, Layer, LayerProps } from 'react-map-gl'
import { Properties, FeatureCollection } from '@turf/helpers'

export const LayerId = 'heatmap'

const layerStyle: LayerProps = {
  id: 'all-areas-heat',
  type: 'heatmap',
  source: 'all-areas',
  maxzoom: 15,
  paint: {
    // Increase the heatmap weight based on frequency and property magnitude
    'heatmap-weight': [
      'interpolate',
      ['linear'],
      ['get', 'totalClimbs'],
      0,
      0,
      40,
      1
    ],
    // Increase the heatmap color weight weight by zoom level
    // heatmap-intensity is a multiplier on top of heatmap-weight
    'heatmap-intensity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      1,
      9,
      3
    ],
    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
    // Begin color ramp at 0-stop with a 0-transparancy color
    // to create a blur-like effect.
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(198, 219, 239,0)',
      0.2,
      '#9ecae1',
      0.4,
      '#6baed6',
      0.6,
      '#4292c6',
      0.8,
      '#2171b5',
      1,
      '#084594'
    ],
    // Adjust the heatmap radius by zoom level
    'heatmap-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      2,
      9,
      20
    ],
    // Transition from heatmap to circle layer by zoom level
    'heatmap-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      8,
      0.45,
      16,
      1
    ]
  }
}

interface MarkerLayerProps {
  geojson: FeatureCollection<GeoJSON.Geometry, Properties> | undefined
}
/**
 * Build a heatmap layer using native Mapbox GL style.
 */
export default function HeatmapLayer ({ geojson }: MarkerLayerProps): JSX.Element | null {
  if (geojson == null) return null
  return (
    <Source
      id='heatmap'
      type='geojson'
      data={geojson}
    >
      <Layer {...layerStyle} />
    </Source>
  )
}
