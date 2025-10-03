'use client'
import { Source, Layer, LineLayer } from 'react-map-gl'
import { useCallback, useEffect, useState } from 'react'
import { CameraInfo, GlobalMap } from '@/components/maps/GlobalMap'
import { useRouter, useSearchParams } from 'next/navigation'
import { MapLayerMouseEvent } from 'maplibre-gl'
import { useUrlParams } from '@/js/hooks/useUrlParams'
import { lineString, Position } from '@turf/helpers'
import lineToPolygon from '@turf/line-to-polygon'

export const FullScreenMap: React.FC = () => {
  const [center, setCenter] = useState<[number, number] | undefined>(undefined)
  const [zoom, setZoom] = useState<number | undefined>(undefined)
  const [areaId, setAreaId] = useState<string | undefined>(undefined)
  const [isInitialized, setIsInitialized] = useState(false)
  const [polygon, setPolygon] = useState<Position[] | null>(null)
  const DEFAULT_ZOOM = 2

  const router = useRouter()
  const urlParams = useUrlParams()
  const searchParams = useSearchParams()

  // Handle initial state setup only once
  useEffect(() => {
    if (isInitialized) return

    const { camera, areaId: urlAreaId } = urlParams.fromUrl()

    if (urlAreaId != null) {
      setAreaId(urlAreaId)
    }

    // If camera params exist in URL, use them
    if (camera != null) {
      setCenter([camera.center.lng, camera.center.lat])
      setZoom(camera.zoom)
      setIsInitialized(true)
      return
    }

    // If no camera params, get visitor location and set URL
    setZoom(DEFAULT_ZOOM)
  }, [urlParams, isInitialized, router])

  const handleCameraMovement = useCallback(
    (camera: CameraInfo) => {
      const { areaId } = urlParams.fromUrl()
      const url = urlParams.toUrl({ camera, areaId })
      router.replace(url, { scroll: false })
    },
    [urlParams, router]
  )

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const areaId = e.features?.[0]?.properties?.id ?? null
      const { camera } = urlParams.fromUrl()
      const url = urlParams.toUrl({ camera: camera ?? null, areaId })
      router.replace(url, { scroll: false })
    }, [urlParams, router]
  )

  useEffect(() => {
    const polygonParam = searchParams.get('polygon')
    if (polygonParam !== null && polygonParam !== '') {
      setPolygon(JSON.parse(decodeURIComponent(polygonParam)))
    }
  }, [searchParams])
  const boundary = Array.isArray(polygon) ? lineToPolygon(lineString(polygon), { properties: { name: 'Imported Polygon' } }) : null

  const locationParamsRaw = useSearchParams().get('bbox')
  const locationParams: [number, number, number, number] | undefined =
    locationParamsRaw != null && locationParamsRaw !== ''
      ? (locationParamsRaw.split(',').map(Number) as [number, number, number, number])
      : undefined

  const fitBoundOpts: maplibregl.FitBoundsOptions = { padding: { top: 45, left: 45, bottom: 45, right: 45 }, duration: 0, maxZoom: 12 }

  const areaPolygonStyle: LineLayer = {
    id: 'polygon',
    type: 'line',
    paint: {
      'line-opacity': ['step', ['zoom'], 0.85, 10, 0.5],
      'line-width': ['step', ['zoom'], 4, 8, 6],
      'line-color': 'rgb(219,39,119)',
      'line-blur': 4
    }
  }

  return (
    <GlobalMap
      showFullscreenControl={false}
      initialAreaId={areaId}
      initialCenter={center}
      initialViewState={
        locationParams !== undefined && locationParams !== null
          ? {
              bounds: locationParams,
              fitBoundsOptions: fitBoundOpts
            }
          : undefined
      }
      initialZoom={zoom}
      onCameraMovement={handleCameraMovement}
      handleOnClick={handleMapClick}
    >
      {boundary != null &&
        <Source id='child-areas-polygon' type='geojson' data={boundary}>
          <Layer {...areaPolygonStyle} />
        </Source>}
    </GlobalMap>
  )
}
