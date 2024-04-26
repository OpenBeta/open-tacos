'use client'
import { useCallback, useEffect, useState } from 'react'
import { CameraInfo, GlobalMap } from '@/components/maps/GlobalMap'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export const FullScreenMap: React.FC = () => {
  const [initialCenter, setInitialCenter] = useState<[number, number] | undefined>(undefined)
  const [initialZoom, setInitialZoom] = useState<number | undefined>(undefined)
  const router = useRouter()

  const cameraParams = useCameraParams()

  useEffect(() => {
    const initialStateFromUrl = cameraParams.fromUrl()

    if (initialStateFromUrl != null) {
      setInitialCenter([initialStateFromUrl.center.lng, initialStateFromUrl.center.lat])
      setInitialZoom(initialStateFromUrl.zoom)
      return
    }

    getVisitorLocation().then((visitorLocation) => {
      if (visitorLocation != null) {
        setInitialCenter([visitorLocation.longitude, visitorLocation.latitude])
      }
    }).catch(() => {
      console.log('Unable to determine user\'s location')
    })
  }, [])

  const handleCamerMovement = useCallback((camera: CameraInfo) => {
    const url = cameraParams.toUrl(camera)

    router.replace(url, { scroll: false })
  }, [])

  return (
    <GlobalMap
      showFullscreenControl={false}
      initialCenter={initialCenter}
      initialZoom={initialZoom}
      onCameraMovement={handleCamerMovement}
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

function useCameraParams (): { toUrl: (camera: CameraInfo) => string, fromUrl: () => CameraInfo | null } {
  const pathname = usePathname()
  const initialSearchParams = useSearchParams()

  function toUrl (camera: CameraInfo): string {
    const params = new URLSearchParams(initialSearchParams)
    params.delete('camera')
    params.append('camera', cameraInfoToQuery(camera))

    return `${pathname}?${params.toString()}`
  }

  function fromUrl (): CameraInfo | null {
    const cameraParams = initialSearchParams.get('camera')
    if (cameraParams == null) {
      return null
    }

    return queryToCameraInfo(cameraParams)
  }

  return { toUrl, fromUrl }
}

const cameraInfoToQuery = ({ zoom, center }: CameraInfo): string => {
  return `${Math.ceil(zoom)}/${center.lat.toPrecision(3)}/${center.lng.toPrecision(3)}`
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
