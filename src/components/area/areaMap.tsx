'use client'
import * as React from 'react'
import { Map, ScaleControl, FullscreenControl, NavigationControl, LngLatBoundsLike, MapboxMap, Source, Layer, FillLayer } from 'react-map-gl'
import dynamic from 'next/dynamic'
import { Padding } from '@math.gl/web-mercator/dist/fit-bounds'
import { featureCollection } from '@turf/helpers'
import bbox2Polygon from '@turf/bbox-polygon'
import convexHull from '@turf/convex'

import { AreaMetadataType, AreaType } from '../../js/types'
import { MAP_STYLES } from '../maps/BaseMap'

type ChildArea = Pick<AreaType, 'uuid' | 'areaName'> & { metadata: Pick<AreaMetadataType, 'lat' | 'lng' | 'leaf' | 'bbox'> }
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

  const childAreas = props.subAreas.map((area) => {
    const { metadata } = area
    return bbox2Polygon(metadata.bbox)
  })

  const childAreasFC = featureCollection(childAreas)

  const boundary = convexHull(childAreasFC, { properties: { name: props.area.areaName } })

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
      >{boundary != null &&
        <Source id='child-areas-polygon' type='geojson' data={featureCollection([boundary])}>
          <Layer {...areaPolygonStyle} />
        </Source>}
        <ScaleControl />
        <FullscreenControl />
        <NavigationControl showCompass={false} />
      </Map>
    </div>
  )
}

export const LazyAreaMap = dynamic<AreaMapProps>(async () => await import('./areaMap').then(
  module => module.default), {
  ssr: true
})

const areaPolygonStyle: FillLayer = {
  id: 'polygon',
  type: 'fill',
  paint: {
    'fill-color': '#F15E40',
    'fill-opacity': ['interpolate', ['linear'], ['zoom'], 8, 0.40, 16, 0.1]
  }
}
