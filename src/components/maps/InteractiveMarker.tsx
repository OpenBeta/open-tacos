import { memo } from 'react'
import { Marker } from 'react-map-gl'

interface ActiveMarkerProps {
  lnglat: number[] | null
  hover?: boolean
}

function InteractiveMarker ({ lnglat, hover = true }: ActiveMarkerProps): JSX.Element | null {
  if (lnglat === null) return null
  return (
    <Marker
      longitude={lnglat[0]}
      latitude={lnglat[1]}
    >
      <div className={`w-6 h-6 border-2 ${hover ? 'border-blue-400' : 'border-ob-primary'}`} />
    </Marker>
  )
}

export default memo(InteractiveMarker)
