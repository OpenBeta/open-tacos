import React, { useState, useCallback, useEffect } from 'react'
import { GeoJsonLayer } from '@deck.gl/layers'
import IconClusterLayer from './layers/IconClusterLayer'
import { DEFAULT_INITIAL_VIEWSTATE } from './BaseMap'
import { getPieIcon, getTotal, getTypePieData } from './ui/PieIcon'
import { CountByGroupType, BBoxType } from '../../js/types'
import { bbox2Viewport } from '../../js/GeoHelpers'

const NAV_BAR_OFFSET = 66

interface HeatmapProps {
  geojson?: string
  children?: any[]
  getTooltip?: any
  bbox: BBoxType
  onClick: (obj: any) => void
  className?: string
}

export default function ClusterMap ({ onClick, geojson, bbox, children, getTooltip, className = '' }: HeatmapProps): JSX.Element {
  const [[width, height], setWH] = useState([400, 400])

  const [viewstate, setViewState] = useState(DEFAULT_INITIAL_VIEWSTATE)

  useEffect(() => {
    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  // eslint-disable-next-line
  const onViewStateChange = useCallback(({ viewState }) => {
    setViewState(viewState)
  }, [viewstate])

  const updateDimensions = useCallback(() => {
    const { width, height } = getMapDivDimensions('cluster-map')
    setWH([width, height])
  }, [width, height])

  useEffect(() => {
    const vs = bbox2Viewport(bbox, width, height)

    setViewState({ ...DEFAULT_INITIAL_VIEWSTATE, ...vs })
  }, [children])

  const data = geojson !== undefined ? geojson : []

  const onClickHandler = (d): void => {
    onClick(d)
  }
  const layers = [
    new GeoJsonLayer({
      id: 'geojson-layer',
      data,
      pickable: false,
      stroked: true,
      filled: viewstate.zoom < 8,
      extruded: false,
      pointType: 'circle',
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getFillColor: [251, 113, 133, 50],
      opacity: viewstate.zoom < 6 ? 1 : 0.2,
      getLineColor: [253, 164, 175],
      getPointRadius: 100,
      getLineWidth: 4,
      getElevation: 0
    }),

    new IconClusterLayer({
      id: 'icon-layer',
      data: children,
      pickable: true,
      getIcon: (d) => {
        return {
          url: svgToDataURL(getSvg(d)),
          width: 100,
          height: 100
        }
      },
      sizeScale: 10,
      onClick: onClickHandler,
      reduce: (acc: {sum: number, types: Record<string, number> }, node) => {
        const areaTypes: Record<string, number> = node.types
        // duplicate previous data so we don't modify it
        const allTypes: Record<string, number > = {}
        for (const typeLabel in acc.types) {
          allTypes[typeLabel] = acc.types[typeLabel]
        }
        // Add in the current areas data
        for (const i in areaTypes) {
          const count = areaTypes[i]
          allTypes[i] = allTypes[i] === undefined ? count : allTypes[i] + count
          acc.sum += count
        }
        acc.types = allTypes
      },
      map: (d) => {
        const acc: Record<string, number> = {}
        let sum = 0
        for (let i = 0; i < d.aggregate.byType.length; i++) {
          const { label, count }: CountByGroupType = d.aggregate.byType[i]
          if (acc[label] === undefined) {
            acc[label] = 0
          }
          sum += count
          acc[label] = acc[label] + count
        }

        return { types: acc, sum }
      }
    })
  ]

  return (
    <div
      id='my-area-map'
      className={`w-full relative xl:sticky xl:top-16 z-9 xl:m-0 xl:p-0 ${className}`}
      style={{ height }}
    >
      <div>{layers}Fix BaseMap</div>
      {/* <BaseMap
        // getTooltip={getTooltip}
        // layers={layers}
        initialViewState={viewstate}
        viewstate={viewstate}
        onViewStateChange={onViewStateChange}
      /> */}
    </div>
  )
}

function svgToDataURL (svg): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function getSvg (d): string {
  if (d.properties.types === undefined) {
    const formatType: Array<[string, number]> = d.properties.aggregate.byType.map(({ label, count }) => [label, count])
    return getPieIcon({
      data: getTypePieData(formatType),
      text: getTotal(formatType).toString()
    })
  }
  const types = Object.entries(d.properties.types as Record<string, number>)
  return getPieIcon({
    data: getTypePieData(types),
    text: getTotal(types).toString()
  })
}

const getMapDivDimensions = (id: string): {width: number, height: number} => {
  const div = document.getElementById(id)
  let width = 200
  if (div != null) {
    width = div.clientWidth
  }
  const height = window.innerHeight - NAV_BAR_OFFSET
  return { width, height }
}
