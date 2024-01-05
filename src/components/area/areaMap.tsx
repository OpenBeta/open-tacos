'use client'
import * as React from 'react'
import { Map, ScaleControl, FullscreenControl, LngLatBoundsLike, MapboxMap } from 'react-map-gl'
import dynamic from 'next/dynamic'
import { AreaMetadataType, AreaType } from '../../js/types'
import { MAP_STYLES } from '../maps/BaseMap'
import { Padding } from '@math.gl/web-mercator/dist/fit-bounds'

type ChildArea = Pick<AreaType, 'uuid' | 'areaName'> & { metadata: Pick<AreaMetadataType, 'lat' | 'lng'> }
interface AreaMapProps {
  subAreas: ChildArea[]
  area: AreaType
  focused: string | null
  selected: string | null
}

// TODO: use built-in getBounds()
/** get the bounds needed to display this map */
function getBounds (area: AreaType): [[number, number], [number, number]] {
  const initlat = area.metadata.lat
  const initlng = area.metadata.lng

  let [minLat, maxLat] = [initlat, initlat]
  let [minLon, maxLon] = [initlng, initlng]

  if (area.children.length > 0) {
    area.children.forEach((area) => {
      const { lat, lng } = area.metadata
      if (lat > maxLat) {
        maxLat = lat
      } else if (lng > maxLon) {
        maxLon = lng
      }
      if (lat < minLat) {
        minLat = lat
      } else if (lng < minLon) {
        minLon = lng
      }
    })
  }

  return [
    [minLon, minLat], // SouthWest corner
    [maxLon, maxLat]
  ] // northeastern corner of the bounds
}

function computeVS (area: AreaType): LngLatBoundsLike {
  return getBounds(area)
}

export default function AreaMap (props: AreaMapProps): JSX.Element {
  const mapRef = React.useRef(null)
  let padding: Padding = { top: 45, left: 45, bottom: 45, right: 45 }
  if (props.subAreas.length === 0) {
    padding = { top: 100, left: 100, bottom: 100, right: 100 }
  }

  React.useEffect(() => {
    // re-compute bounds whenever the area changes
    if (mapRef.current !== null) {
      const map: MapboxMap = mapRef.current as any
      const bounds = computeVS(props.area)
      map.fitBounds(bounds, { padding })
    }
  }, [props.area.id])

  return (
    <div className='w-full h-full'>
      <Map
        ref={mapRef}
        id='map'
        initialViewState={{
          bounds: computeVS(props.area),
          fitBoundsOptions: { padding }
        }}
        reuseMaps
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        mapStyle={MAP_STYLES.light}
        cooperativeGestures
      >
        {/* {props.subAreas.map((subArea) => (
          <Marker
            style={{ zIndex: subArea.uuid === props.focused ? 100 : 0 }}
            key={subArea.uuid}
            longitude={subArea.metadata.lng}
            latitude={subArea.metadata.lat}
            anchor='bottom'
          >
            <div className={`rounded shadow transition text-xs px-1 font-bold 
            ${subArea.uuid === props.focused ? 'bg-green-500 text-white scale-125' : ' bg-white'}
            ${subArea.uuid === props.selected ? 'bg-violet-500 text-white scale-125' : ' bg-white'}`}
            >
              {subArea.areaName}
            </div>
          </Marker>
        ))}

        <Marker
          style={{ zIndex: 1 }}
          longitude={props.area.metadata.lng}
          latitude={props.area.metadata.lat}
          anchor='bottom'
        >
          <div className='rounded shadow transition text-md px-1 font-bold bg-violet-500 text-white scale-125 z-index-1'>
            {props.area.areaName}
          </div>
        </Marker> */}

        <ScaleControl />
        <FullscreenControl />
      </Map>
    </div>
  )
}

export const LazyAreaMap = dynamic<AreaMapProps>(async () => await import('./areaMap').then(
  module => module.default), {
  ssr: true
})
