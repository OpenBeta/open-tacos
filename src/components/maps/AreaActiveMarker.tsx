import { Marker, Source, Layer, LineLayer } from 'react-map-gl'
import { Point, Polygon } from '@turf/helpers'
import { MapPin } from '@phosphor-icons/react/dist/ssr'

/**
 * Highlight selected feature on the map
 */
export const SelectedFeature: React.FC<{ geometry: Point | Polygon }> = ({ geometry }) => {
  switch (geometry.type) {
    case 'Point':
      return <SelectedPoint geometry={geometry} />
    case 'Polygon':
      return <SelectedPolygon geometry={geometry} />
    default: return null
  }
}

const SelectedPoint: React.FC<{ geometry: Point }> = ({ geometry }) => {
  const { coordinates } = geometry
  return (
    <Marker longitude={coordinates[0]} latitude={coordinates[1]}>
      <MapPin size={36} weight='fill' className='text-accent' />
    </Marker>
  )
}

export const SelectedPolygon: React.FC<{ geometry: Polygon }> = ({ geometry }) => {
  return (
    <Source id='selected-polygon' type='geojson' data={geometry}>
      <Layer {...selectedBoundary} />
    </Source>
  )
}

const selectedBoundary: LineLayer = {
  id: 'polygon2',
  type: 'line',
  paint: {
    'line-opacity': ['step', ['zoom'], 0.85, 10, 0.5],
    'line-width': ['step', ['zoom'], 2, 10, 10],
    'line-color': '#004F6E', // See 'area-cue' in tailwind.config.js
    'line-blur': 4
  }
}
