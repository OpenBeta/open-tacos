import { Marker } from 'react-map-gl'
import { Point } from '@turf/helpers'
import { MapPin } from '@phosphor-icons/react/dist/ssr'

export const AreaActiveMarker: React.FC<{ point: Point }> = ({ point }) => {
  const { coordinates } = point
  return (
    <Marker longitude={coordinates[0]} latitude={coordinates[1]} style={{ zIndex: 2000 }}>
      <MapPin size={36} weight='fill' className='text-accent' />
    </Marker>
  )
}
