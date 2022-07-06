import { useEffect, useState } from 'react'
import { featureCollection } from '@turf/helpers'
import { Dictionary } from 'underscore'

import useAutoSizing from '../../js/hooks/finder/useMapAutoSizing'
import BaseMap from '../maps/BaseMap'
import HeatmapLayer from '../maps/HeatmapLayer'
import { MarkerLayer2 } from '../maps/MarkerLayer'
import { MediaBaseTag, MediaType } from '../../js/types'
import { geojsonifyCrag } from '../../js/stores/util'
import { getCragsWithinNicely } from '../../js/graphql/api'

export interface RecentTagsProps {
  tags: Dictionary<MediaBaseTag[]>
  mediaList: MediaType[]
}

const mapElementId = 'global-map'
export default function Map (): JSX.Element {
  const [viewstate, height, setViewState] = useAutoSizing({ geojson: null, elementId: mapElementId })

  const [geojson, setData] = useState([])

  useEffect(() => {
    void getCragsWithinNicely({ bbox: viewstate.bbox, zoom: viewstate.zoom }).then(
      data => {
        if (data?.length > 0) {
          setData(data.map(crag => geojsonifyCrag(crag, false)))
        }
      }
    )
  }, [viewstate])

  return (
    <div
      id={mapElementId}
      className='z-10 absolute inset-0 h-screen w-full h-full'
      style={{ height: height - 64 }}
    >

      <BaseMap
        height={height - 64}
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
