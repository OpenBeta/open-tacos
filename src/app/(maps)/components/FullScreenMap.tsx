'use client'
import { useCallback, useEffect, useState } from 'react'
import { CameraInfo, GlobalMap } from '@/components/maps/GlobalMap'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { MapLayerMouseEvent } from 'maplibre-gl'

export const FullScreenMap: React.FC = () => {
  const [center, setCenter] = useState<[number, number] | undefined>(undefined)
  const [zoom, setZoom] = useState<number | undefined>(undefined)
  const [areaId, setAreaId] = useState<string | undefined>(undefined)
  const [isInitialized, setIsInitialized] = useState(false)

  const router = useRouter()
  const urlParams = useUrlParams()

  // Handle initial state setup only once
  useEffect(() => {
    if (isInitialized) return

    const { camera, areaId: urlAreaId } = urlParams.fromUrl()
    const DEFAULT_CENTER: [number, number] = [-98.5795, 39.8283] // Center of US
    const DEFAULT_ZOOM = 3

    if (urlAreaId !== null) {
      setAreaId(urlAreaId)
    }

    // If camera params exist in URL, use them
    if (camera !== null) {
      setCenter([camera.center.lng, camera.center.lat])
      setZoom(camera.zoom)
      setIsInitialized(true)
      return
    }

    // If no camera params, get visitor location and set URL
    setZoom(DEFAULT_ZOOM)
    getVisitorLocation()
      .then((visitorLocation) => {
        const newCenter: [number, number] = (visitorLocation != null)
          ? [visitorLocation.longitude, visitorLocation.latitude]
          : DEFAULT_CENTER

        setCenter(newCenter)

        // Always update URL with camera position
        const newCamera: CameraInfo = {
          center: {
            lng: newCenter[0],
            lat: newCenter[1]
          },
          zoom: DEFAULT_ZOOM
        }

        const url = urlParams.toUrl({
          camera: newCamera,
          areaId: urlAreaId
        })
        router.replace(url, { scroll: false })
      })
      .catch(() => {
        console.log('Unable to determine user\'s location')
        setCenter(DEFAULT_CENTER)

        // Set URL with default camera position on error
        const defaultCamera: CameraInfo = {
          center: {
            lng: DEFAULT_CENTER[0],
            lat: DEFAULT_CENTER[1]
          },
          zoom: DEFAULT_ZOOM
        }

        const url = urlParams.toUrl({
          camera: defaultCamera,
          areaId: urlAreaId
        })
        router.replace(url, { scroll: false })
      })
      .finally(() => {
        setIsInitialized(true)
      })
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
      const areaId = e.features?.[0]?.properties?.id
      if (areaId == null) {
        return
      }

      const { camera } = urlParams.fromUrl()
      const url = urlParams.toUrl({ camera: camera ?? null, areaId })
      router.replace(url, { scroll: false })
    }, [urlParams, router]
  )

  return (
    <GlobalMap
      initialAreaId={areaId}
      initialCenter={center}
      initialZoom={zoom}
      onCameraMovement={handleCameraMovement}
      handleOnClick={handleMapClick}
    />
  )
}

const getVisitorLocation = async (): Promise<{ longitude: number, latitude: number } | undefined> => {
  try {
    const res = await fetch('/api/geo')
    return await res.json()
  } catch (err) {
    console.log('ERROR', err)
    return undefined
  }
}

interface UrlProps { camera: CameraInfo | null, areaId: string | null }

interface UseUrlParamsReturn {
  toUrl: (props: UrlProps) => string
  fromUrl: () => UrlProps
}

const useUrlParams = (): UseUrlParamsReturn => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const toUrl = ({ camera, areaId }: UrlProps): string => {
    const params = new URLSearchParams()

    if (areaId !== null && areaId !== undefined) {
      params.set('areaId', areaId)
    }

    const baseUrl = `${pathname}?`
    const cameraParam = (camera !== null && camera !== undefined) ? `camera=${cameraInfoToQuery(camera)}` : ''
    const otherParams = params.toString()

    if (cameraParam !== null && otherParams !== null) {
      return `${baseUrl}${cameraParam}&${otherParams}`
    } else if (cameraParam !== null) {
      return `${baseUrl}${cameraParam}`
    } else if (otherParams !== null) {
      return `${baseUrl}${otherParams}`
    }

    return pathname
  }

  const fromUrl = (): UrlProps => {
    const rawUrl = window.location.search
    const cameraMatch = rawUrl.match(/[?&]camera=([^&]+)/)
    const cameraParam = (cameraMatch !== null) ? cameraMatch[1] : null

    return {
      camera: cameraParam !== null ? queryToCameraInfo(cameraParam) : null,
      areaId: searchParams.get('areaId')
    }
  }

  return { toUrl, fromUrl }
}

const cameraInfoToQuery = ({ zoom, center }: CameraInfo): string => {
  return `${Math.ceil(zoom)}/${center.lat.toFixed(5)}/${center.lng.toFixed(5)}`
}

const queryToCameraInfo = (cameraParam: string): CameraInfo | null => {
  const [zoomRaw, latitude, longitude] = cameraParam.split('/')
  const lat = parseFloat(latitude)
  const lng = parseFloat(longitude)
  const zoom = parseInt(zoomRaw, 10)

  if ([lat, lng, zoom].some(isNaN)) {
    return null
  }

  return {
    center: { lat, lng },
    zoom
  }
}
