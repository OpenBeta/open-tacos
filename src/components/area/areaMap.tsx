import * as React from 'react'
import { Map, Marker, ScaleControl, LngLatBoundsLike, MapboxMap } from 'react-map-gl'
import { AreaType } from '../../js/types'
import { MAP_STYLES } from '../maps/BaseMap'

interface AreaMapProps {
  subAreas: AreaType[]
  area: AreaType
  /** Id of the focused sub-area */
  focused: string | null
}

/** get the bounds needed to display this map */
function getBounds (areas: AreaType[]): [[number, number], [number, number]] {
  if (areas.length > 0) {
    const initlat = areas[0].metadata.lat
    const initlng = areas[0].metadata.lng
    let [minLat, maxLat] = [initlat, initlat]
    let [minLon, maxLon] = [initlng, initlng]

    areas.forEach((area) => {
      const { lat, lng } = area.metadata
      if (lat > maxLat) { maxLat = lat } else if (lng > maxLon) {
        maxLon = lng
      }
      if (lat < minLat) { minLat = lat } else if (lng < minLon) {
        minLon = lng
      }
    })

    return [
      [minLon, minLat], // SouthWest corner
      [maxLon, maxLat]] // northeastern corner of the bounds
  }
  // all 0s acts the same as no bounds (empty bounds) and so bounds will be
  // skipped by map and use zoom instead
  return null
}

function computeVS (area: AreaType, subAreas: AreaType[]): LngLatBoundsLike {
  return getBounds(subAreas)
}

export default function AreaMap (props: AreaMapProps): JSX.Element {
  const mapRef = React.useRef(null)
  const padding = { top: 45, left: 45, bottom: 45, right: 45 }
  const [viewState, setVs] = React.useState({ bounds: computeVS(props.area, props.subAreas), padding })

  React.useEffect(() => {
    // re-compute bounds whenever the area changes
    if (mapRef.current !== null) {
      const map: MapboxMap = (mapRef.current as any)
      map.fitBounds(computeVS(props.area, props.subAreas), { padding })
    }
  }, [props.area.id])

  return (
    <div className='w-full h-full rounded-xl overflow-hidden'>
      <Map
        {...{ ...viewState, padding }}
        onMove={({ viewState }) => setVs(viewState as any)}
        ref={mapRef}
        id='areaHeatmap2'
        reuseMaps
        mapboxAccessToken='pk.eyJ1IjoibWFwcGFuZGFzIiwiYSI6ImNqcDdzbW12aTBvOHAzcW82MGg0ZTRrd3MifQ.MYiNJHklgMkRzapAKuTQNg'
        mapStyle={MAP_STYLES.dark}
      >
        <Marker longitude={props.area.metadata.lng} latitude={props.area.metadata.lat} anchor='bottom'>
          <div className='text-xl font-bold'>
            {props.area.areaName}
          </div>
        </Marker>

        {props.subAreas.map(subArea => (
          <Marker
            style={{ zIndex: subArea.id === props.focused ? 100 : 0 }}
            key={subArea.id}
            longitude={subArea.metadata.lng}
            latitude={subArea.metadata.lat}
            anchor='bottom'
          >
            <div className={`rounded shadow transition text-xs px-1 font-bold 
            ${subArea.id === props.focused ? 'bg-green-500 text-white scale-125' : ' bg-white'}`}
            >
              {subArea.areaName}
            </div>
          </Marker>))}

        <ScaleControl />
      </Map>
    </div>
  )
}
