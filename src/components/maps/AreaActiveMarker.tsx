import { Marker } from 'react-map-gl'
import { Point } from '@turf/helpers'
import { MapPin } from '@phosphor-icons/react/dist/ssr'
import { ActiveFeature } from './TileTypes'

/**
 * Highlight selected feature on the map
 */
export const SelectedFeature: React.FC<{ feature: ActiveFeature }> = ({ feature }) => {
  switch (feature.type) {
    case 'crag-markers':
    case 'crag-name-labels':
      return <SelectedPoint geometry={feature.geometry as Point} />
    default: return null
  }
}

const SelectedPoint: React.FC<{ geometry: Point }> = ({ geometry }) => {
  const { coordinates } = geometry
  return (
    <Marker longitude={coordinates[0]} latitude={coordinates[1]}>
      <div className='absolute bottom-0 -translate-x-1/2'>
        <MapPin size={48} weight='fill' className='text-accent' />
      </div>
    </Marker>
  )
}
