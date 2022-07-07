import { useEffect, useState } from 'react'
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

  useEffect(() => {
    if (viewstate.bbox[0] === 0 && viewstate.bbox[1] === 0) return
    progressStart()
    // Optimization Todo:
    // Right now even a smallest change in pan/zoom will trigger a backend API call.
    // Based on viewstate, calculate a change tolerant to reduce the number of calls.
    // Tip: https://visgl.github.io/react-map-gl/docs/get-started/state-management#custom-camera-constraints
    void getCragsWithinNicely({ bbox: viewstate.bbox, zoom: viewstate.zoom }).then(
      data => {
        if (data?.length > 0) {
          setData(data.map(crag => geojsonifyCrag(crag, false)))
        }
        progressStop()
      }
    )
  }, [viewstate])

  return (
    <div
      id={mapElementId}
      className='z-10 absolute inset-0 w-full h-full bg-gray-100'
      style={{ height: height - 54 }}
    >

      <BaseMap
        height={height - 54}
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
