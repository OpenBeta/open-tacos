'use client'
import { useCallback, useEffect, useState } from 'react'
import { CameraInfo, GlobalMap } from '@/components/maps/GlobalMap'
import { useRouter } from 'next/navigation'
import { MapLayerMouseEvent } from 'maplibre-gl'
import { useUrlParams } from '@/js/hooks/useUrlParams'

export const FullScreenMap: React.FC = () => {
  const [center, setCenter] = useState<[number, number] | undefined>(undefined)
  const [zoom, setZoom] = useState<number | undefined>(undefined)
  const [areaId, setAreaId] = useState<string | undefined>(undefined)
  const [isInitialized, setIsInitialized] = useState(false)
  const DEFAULT_CENTER: [number, number] = [0, 0]
  const DEFAULT_ZOOM = 2

  const router = useRouter()
  const urlParams = useUrlParams()

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
      const areaId = e.features?.[0]?.properties?.id ?? null
      const { camera } = urlParams.fromUrl()
      const url = urlParams.toUrl({ camera: camera ?? null, areaId })
      router.replace(url, { scroll: false })
    }, [urlParams, router]
  )

  return (
    <GlobalMap
      showFullscreenControl={false}
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
