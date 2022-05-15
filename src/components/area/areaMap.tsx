import * as React from 'react'
import { ViewState, Map, Marker, ScaleControl, MapboxMap } from 'react-map-gl'
import { AreaType } from '../../js/types'
import { MAP_STYLES } from '../maps/BaseMap'

interface AreaMapProps {
  subAreas: AreaType[]
  area: AreaType
  /** Id of the focused sub-area */
  focused: string | null
}

interface PartialViewState {
  latitude: number
  longitude: number
  bounds?: [
    [number, number],
    [number, number]
  ]
}

function getDistanceFromLatLon ([lat1, lon1], [lat2, lon2]): number {
  function radians (deg: number): number {
    return deg * (Math.PI / 180)
  }

  const dLat = radians(lat2 - lat1)
  const dLon = radians(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radians(lat1)) * Math.cos(radians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return c
}

/** This will return up to the nearest two sub-areas to the requested
 * focus option. This allows the zoom-to-area to behave contextually.
 * If you are looking at the area "USA", then the sub-areas will be much
 * further away than if you are looking at the area "USA > ALABAMA > SOME TOWN"
 * so we infer zoom from density.
 */
function computeNearestSubAreas (areas: AreaType[], focused: AreaType, retN: number): AreaType[] {
  /** This just makes it easier to change how many nearby areas we want to show
   * (By adjusting the pool in the closure) */
  function getNearest (_pool: AreaType[]): AreaType {
    let nearest: AreaType = _pool.find(i => i.id !== focused.id)
    let nearestDistance = getDistanceFromLatLon([nearest.metadata.lat, nearest.metadata.lng], [focused.metadata.lat, focused.metadata.lng])

    _pool.forEach(area => {
      if (area.id === focused.id) {
        return
      }
      const distFromTarget =
      getDistanceFromLatLon(
        [area.metadata.lat, area.metadata.lng],
        [focused.metadata.lat, focused.metadata.lng])

      if (distFromTarget < nearestDistance) {
        nearest = area
        nearestDistance = distFromTarget
      }
    })
    return nearest
  }
  const subAreas: AreaType[] = []
  let pool: AreaType[] = areas

  for (let i = 0; i < retN; i++) {
    subAreas.push(getNearest(pool))
    // Now remove that item from the pool so we can keep ordering
    pool = pool.filter(item => item.id !== subAreas[i].id)
  }

  console.log({ subAreas })
  return subAreas
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

function computeVS (area: AreaType, subAreas: AreaType[], focusedId: string | null): PartialViewState {
  // If an area is selected, we could return bounds that center on the selected item,
  // but includes the nearest neighbour in the parent area.
  const targetArea = subAreas.find(i => i.id === focusedId)
  if (focusedId === null || (targetArea === undefined && focusedId !== null)) {
    return {
      latitude: area.metadata.lat,
      longitude: area.metadata.lng,
      bounds: getBounds(subAreas)
    }
  }

  return {
    latitude: targetArea.metadata?.lat,
    longitude: targetArea.metadata?.lng,
    bounds: getBounds([targetArea, ...computeNearestSubAreas(subAreas, targetArea, 1)])
  }
}

export default function AreaMap (props: AreaMapProps): JSX.Element {
  const mapRef = React.useRef(null)
  const [viewState, setViewState] =
    React.useState<PartialViewState>(computeVS(props.area, props.subAreas, props.focused))

  React.useEffect(() => {
    // setViewState(computeVS(props.area, props.subAreas, props.focused))
    if (mapRef.current !== null) {
      const vs = computeVS(props.area, props.subAreas, props.focused)
      const map: MapboxMap = (mapRef.current as any)

      // The animation may be slightly more than just an aesthetic choice.
      // The visual snap helps to hide the time it takes for the map data at the new location
      // to load up. Reduces the sense of disorientation.
      const options = {
        // speed of movement (not animation as a while)
        speed: 6,
        // This is the speed of zoom in particular. The faster, the more the zoom effect
        curve: 1.5,

        // This is our easing function. https://easings.net/ is an incredible resource
        // This is a cubic in-out, and I like it - but could just as easily by linear or
        // some other easing function.
        easing: (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
        // this animation is considered essential with respect to prefers-reduced-motion
        essential: true,
        padding: { top: 45, left: 45, bottom: 45, right: 45 }
      }

      if (vs.bounds === undefined) {
        map.flyTo({
          // These options control the ending camera position: centered at target
          center: [vs.longitude, vs.latitude],
          ...options
        })
      } else {
        // This will zoom out to show the entire area. Centering on a focused target
        // is a little tricky
        map.fitBounds(vs.bounds, options)
      }
    }
  }, [props.focused, props.area.id])

  const handleMove = ({ viewState }: {viewState: ViewState}): void => {
    setViewState(viewState)
  }
  const padding = { top: 45, left: 45, bottom: 45, right: 45 }

  return (
    <div className='w-full h-full rounded-xl overflow-hidden'>
      <Map
        {...{ ...viewState, padding }}
        ref={mapRef}
        id='areaHeatmap2'
        reuseMaps
        mapboxAccessToken='pk.eyJ1IjoibWFwcGFuZGFzIiwiYSI6ImNqcDdzbW12aTBvOHAzcW82MGg0ZTRrd3MifQ.MYiNJHklgMkRzapAKuTQNg'
        mapStyle={MAP_STYLES.dark}
        fadeDuration={200}
        onMove={handleMove}
      >
        <Marker longitude={props.area.metadata.lng} latitude={props.area.metadata.lat} anchor='bottom'>
          <div className='text-xl font-bold'>
            {props.area.areaName}
          </div>
        </Marker>

        {props.subAreas.map(subArea => (
          <Marker key={subArea.id} longitude={subArea.metadata.lng} latitude={subArea.metadata.lat} anchor='bottom'>
            <div className={`rounded shadow transition 
            ${subArea.id === props.focused ? 'px-2 font-bold bg-green-500 text-green-100 text-sm' : 'px-1  bg-white text-xs'}`}
            >
              {subArea.areaName}
            </div>
          </Marker>))}

        <ScaleControl />
      </Map>
    </div>
  )
}
