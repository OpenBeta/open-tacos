import { useEffect, useState, useRef } from 'react'
import { featureCollection } from '@turf/helpers'
import NProgress from 'nprogress'
import { debounce } from 'underscore'

import useAutoSizing from '../../js/hooks/finder/useMapAutoSizing'
import BaseMap from '../maps/BaseMap'
import HeatmapLayer from '../maps/HeatmapLayer'
import { MarkerLayer2 } from '../maps/MarkerLayer'
import { geojsonifyCrag } from '../../js/stores/util'
import { getCragsWithinNicely } from '../../js/graphql/api'

const mapElementId = 'global-map'
export default function Map (): JSX.Element {
  const [viewstate, height, setViewState] = useAutoSizing({ geojson: null, elementId: mapElementId })

  const [geojson, setData] = useState([])

  const lastUpdatePosition = useRef({ longitude: 0, latitude: 0, zoom: 0 })

  useEffect(() => {
    if (viewstate.bbox[0] === 0 && viewstate.bbox[1] === 0) return

    const shouldFetchData = checkIfShouldFetchData(viewstate, lastUpdatePosition)

    if (shouldFetchData) {
      lastUpdatePosition.current = { longitude: viewstate.longitude, latitude: viewstate.latitude, zoom: viewstate.zoom }
      progressStart()
      void getCragsWithinNicely({ bbox: viewstate.bbox, zoom: viewstate.zoom }).then(
        data => {
          if (data?.length > 0) {
            setData(data.map(crag => geojsonifyCrag(crag, false)))
            progressStop()
          }
        }
      )
    }
  }, [viewstate])

  return (
    <div
      id={mapElementId}
      className='z-10 absolute inset-0 w-full h-full bg-gray-200'
      style={{ height }}
    >

      <BaseMap
        height={height}
        viewstate={viewstate}
        onViewStateChange={setViewState}
        light
        interactiveLayerIds={[]}
      >
        <HeatmapLayer geojson={featureCollection(geojson)} />
        <MarkerLayer2 geojson={featureCollection(geojson)} />
      </BaseMap>
    </div>
  )
}

const progressStart = debounce(NProgress.start, 500)

const progressStop = debounce(NProgress.done, 500)

function checkIfShouldFetchData (viewstate, lastUpdatePosition): boolean {
  return (Math.abs(viewstate.latitude - lastUpdatePosition.current.latitude) >= 0.1 ||
    Math.abs(viewstate.longitude - lastUpdatePosition.current.longitude) > 0.2 ||
    Math.abs(viewstate.zoom - lastUpdatePosition.current.zoom) > 1)
}
