import * as React from 'react'
import { Map, Marker, ScaleControl, LngLatBoundsLike, MapboxMap } from 'react-map-gl'
import { AreaType } from '../../js/types'
import { MAP_STYLES } from '../maps/BaseMap'
import { Padding } from '@math.gl/web-mercator/dist/fit-bounds'

interface Mappable {
  id: string
  metadata: {
    lat: number
    lng: number
  }
  areaName: string
}

interface AreaMapProps {
  subAreas: Mappable[]
  area: AreaType
  focused: string | null
  selected: string | null
}

/** get the bounds needed to display this map */
function getBounds (area: AreaType): [[number, number], [number, number]] {
  const initlat = area.metadata.lat
  const initlng = area.metadata.lng

  let [minLat, maxLat] = [initlat, initlat]
  let [minLon, maxLon] = [initlng, initlng]

  if (area.children.length > 0) {
    area.children.forEach((area) => {
      const { lat, lng } = area.metadata
      if (lat > maxLat) { maxLat = lat } else if (lng > maxLon) {
        maxLon = lng
      }
      if (lat < minLat) { minLat = lat } else if (lng < minLon) {
        minLon = lng
      }
    })
  }

  return [
    [minLon, minLat], // SouthWest corner
    [maxLon, maxLat]] // northeastern corner of the bounds
}

function computeVS (area: AreaType): LngLatBoundsLike {
  return getBounds(area)
}

export default function AreaMap (props: AreaMapProps): JSX.Element {
  const mapRef = React.useRef(null)
  const padding: Padding = { top: 45, left: 45, bottom: 45, right: 45 }

  React.useEffect(() => {
    // re-compute bounds whenever the area changes
    if (mapRef.current !== null) {
      const map: MapboxMap = (mapRef.current as any)
      const bounds = computeVS(props.area)
      map.fitBounds(bounds, { padding })
    }
  }, [props.area.id])

  return (
    <div className='w-full h-full'>
      <Map
        ref={mapRef}
        id='areaHeatmap2'
        initialViewState={{
          bounds: computeVS(props.area),
          fitBoundsOptions: { padding }
        }}
        reuseMaps
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        mapStyle={MAP_STYLES.dark}
        cooperativeGestures
      >
        {props.subAreas.map(subArea => (
          <Marker
            style={{ zIndex: subArea.id === props.focused ? 100 : 0 }}
            key={subArea.id}
            longitude={subArea.metadata.lng}
            latitude={subArea.metadata.lat}
            anchor='bottom'
          >
            <div className={`rounded shadow transition text-xs px-1 font-bold 
            ${subArea.id === props.focused ? 'bg-green-500 text-white scale-125' : ' bg-white'}
            ${subArea.id === props.selected ? 'bg-violet-500 text-white scale-125' : ' bg-white'}`}
            >
              {subArea.areaName}
            </div>
          </Marker>))}

        <Marker style={{ zIndex: 1 }} longitude={props.area.metadata.lng} latitude={props.area.metadata.lat} anchor='bottom'>
          <div className='rounded shadow transition text-md px-1 font-bold bg-violet-500 text-white scale-125 z-index-1'>
            {props.area.areaName}
          </div>
        </Marker>

        <ScaleControl />
      </Map>
    </div>
  )
}
