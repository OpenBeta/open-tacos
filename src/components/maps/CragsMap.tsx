import React, { useState, useCallback } from 'react'

import BaseMap from './BaseMap'
import CragHighlightPopover from '../finder/CragHighlightPopover'
import { store, actions } from '../../js/stores'
import MarkerLayer, { InteractiveLayerIDs as markerLayerIds } from './MarkerLayer'
import HeatmapLayer from './HeatmapLayer'
import InteractiveMarker
  from './InteractiveMarker'
import useAutoSizing from '../../js/hooks/finder/useMapAutoSizing'

const mapElementId = 'my-area-map'
/**
 * Make a map of crag markers.
 */
export default function CragsMap (): JSX.Element {
  const geojson = store.filters.allGeoJson()

  const [viewstate, height, setViewState] = useAutoSizing({ geojson, elementId: mapElementId })

  // track current mouseover marker
  const [hoverMarker, setHoverMarker] = useState<null | number[]>(null)

  const onHoverHandler = useCallback((event) => {
    const { features } = event
    const f = features[0]
    setHoverMarker([f.properties.lng, f.properties.lat])
  }, [])

  const onClickHandler = useCallback((event) => {
    const { features } = event
    const { id, lng, lat } = features[0].properties
    actions.filters.setActiveMarker(id, [lng, lat])
  }, [])

  const { areaId, lnglat } = store.filters.map().active
  const area = areaId != null ? store.filters.areaById(areaId) : null
  return (
    <>
      <div
        id={mapElementId}
        className='w-full absolute top-0 left-0 xl:sticky xl:top-28 xl:m-0 xl:p-0'
        style={{ height }}
      >
        <div className='absolute left-1 top-1 z-50'>
          {area != null &&
            <CragHighlightPopover
              {...area}
            />}
        </div>
        <BaseMap
          height={height}
          viewstate={viewstate}
          onViewStateChange={setViewState}
          light={false}
          onClick={onClickHandler}
          onHover={onHoverHandler}
          interactiveLayerIds={geojson == null ? [] : markerLayerIds}
        >
          <HeatmapLayer geojson={geojson} />
          <MarkerLayer geojson={geojson} />
          <InteractiveMarker
            lnglat={hoverMarker}
          />
          <InteractiveMarker
            lnglat={lnglat}
            hover={false}
          />
        </BaseMap>
      </div>
    </>
  )
}
