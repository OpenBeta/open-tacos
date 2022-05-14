import * as React from 'react'
import { ViewState, Map, Marker } from 'react-map-gl'
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

  zoom?: number
}

/** get the bounds needed to display this map */
function getBounds (areas: AreaType[]): [[number, number], [number, number]] {
  const initlat = areas[0].metadata.lat
  const initlng = areas[0].metadata.lng

  let minLat = initlat
  let maxLat = initlat
  let minLon = initlng
  let maxLon = initlng

  areas.forEach((area) => {
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

  // must be [sw, ne]
  return [[minLat, minLon], [maxLat, maxLon]]
}

function computeVS (area: AreaType, subAreas: AreaType[], focusedId: string | null): PartialViewState {
  if (focusedId === null) {
    return {
      latitude: area.metadata.lat,
      longitude: area.metadata.lng,
      bounds: getBounds(subAreas),
      zoom: 6
    }
  }
  const targetArea = subAreas.find(i => i.id === focusedId)
  return {
    latitude: targetArea.metadata?.lat,
    longitude: targetArea.metadata?.lng,
    zoom: 10
  }
}

export default function AreaMap (props: AreaMapProps): JSX.Element {
  const [viewState, setViewState] =
    React.useState<PartialViewState>(computeVS(props.area, props.subAreas, props.focused))

  React.useEffect(() => {
    setViewState(computeVS(props.area, props.subAreas, props.focused))
  }, [props.subAreas, props.focused])

  const handleMove = ({ viewState }: {viewState: ViewState}): void => {
    setViewState(viewState)
  }

  return (
    <div className='w-full h-full rounded-xl overflow-hidden'>
      <Map
        {...viewState}
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
            <div className='text-xs bg-white px-1 rounded shadow border'>
              {subArea.areaName}
            </div>
          </Marker>))}
      </Map>
    </div>
  )
}
