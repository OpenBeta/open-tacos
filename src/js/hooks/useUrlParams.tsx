import { CameraInfo } from '@/components/maps/GlobalMap'
import { usePathname, useSearchParams } from 'next/navigation'

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

    if (areaId != null) {
      params.set('areaId', areaId)
    }

    const baseUrl = `${pathname}?`
    const cameraParam = camera != null ? `camera=${cameraInfoToQuery(camera)}` : ''
    const otherParams = params.toString()

    const query = [cameraParam, otherParams]
      .filter(param => param !== '') // Remove empty params
      .join('&') // Join non-empty params with `&`

    return query !== '' ? `${baseUrl}${query}` : pathname // Return base URL if query is empty
  }

  const fromUrl = (): UrlProps => {
    const cameraParam = searchParams.get('camera')
    return {
      camera: cameraParam != null ? queryToCameraInfo(cameraParam) : null,
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

export { useUrlParams }
