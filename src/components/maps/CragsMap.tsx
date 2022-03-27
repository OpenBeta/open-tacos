import React, { useMemo, useEffect, useState, useCallback } from 'react'

import { point, featureCollection, Position, Properties, FeatureCollection, Geometry } from '@turf/helpers'

import MapPopper from '../ui/MapPopper'
import BaseMap, { DEFAULT_INITIAL_VIEWSTATE } from './BaseMap'
import { store } from '../../js/stores'
import { AreaType } from '../../js/types'
import { sanitizeName } from '../../js/utils'
import MarkerLayer from './MarkerLayer'
import ActiveMarker
  from './ActiveMarker'
import useAutoSizing from '../../js/hooks/finder/useMapAutoSizing'

export default function CragsMap (): JSX.Element {
  const crags = store.filters.crags()

  const geojson = useMemo(
    () => {
      const points = crags.map((crag: AreaType) => {
        const { id, area_name: name, metadata } = crag
        return point([metadata.lng, metadata.lat], { name: sanitizeName(name), lng: metadata.lng, lat: metadata.lat }, { id: id })
      })
      return featureCollection(points)
    }, [crags])

  // const [viewstate, setViewState] = useState<InitialViewStateProps>(DEFAULT_INITIAL_VIEWSTATE)

  const [viewstate, height, setViewState] = useAutoSizing({ geojson })

  const onViewStateChange = useCallback(({ viewState }) => {
    console.log('#viewstating updating')
    setViewState(viewState)
  }, [])

  const [hoverMarker, setHoverMarker] = useState(null)
  const [activeMarker, setActiveMarker] = useState(null)

  const onHoverHandler = useCallback((event) => {
    const { features } = event
    const f = features[0]
    setHoverMarker([f.properties.lng, f.properties.lat])
  }, [])

  const onClickHandler = useCallback((event) => {
    const { features } = event
    const f = features[0]
    setActiveMarker([f.properties.lng, f.properties.lat]
    )
    console.log('click', features)
  }, [])

  return (
    <div
      id='my-area-map'
      className='w-full xl:sticky xl:top-28 xl:m-0 xl:p-0'
      style={{ height }}
    >

      <BaseMap
        disableController={false}
        layers={[]}
        initialViewState={viewstate}
        viewstate={viewstate}
        onViewStateChange={onViewStateChange}
        light={false}
        onClick={onClickHandler}
        onHover={onHoverHandler}
      >
        <MarkerLayer geojson={geojson} />
        <ActiveMarker hoverMarker={hoverMarker} activeMarker={activeMarker} />
      </BaseMap>
    </div>
  )
}
