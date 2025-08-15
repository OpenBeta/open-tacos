'use client'
import { useCallback, useEffect, useState } from 'react'
import { CameraInfo, GlobalMap } from '@/components/maps/GlobalMap'
import { useRouter } from 'next/navigation'
import { MapLayerMouseEvent } from 'maplibre-gl'
import { useUrlParams } from '@/js/hooks/useUrlParams'
import Spinner from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-toastify'

interface FullScreenMapProps {
  center?: [number, number]
}

export const FullScreenMap: React.FC<FullScreenMapProps> = ({ center: initialCenter }) => {
  const [center, setCenter] = useState<[number, number] | undefined>(initialCenter)
  const [zoom, setZoom] = useState<number | undefined>(undefined)
  const [areaId, setAreaId] = useState<string | undefined>(undefined)
  const [isInitialized, setIsInitialized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const DEFAULT_ZOOM = 2
  const router = useRouter()
  const urlParams = useUrlParams()
  useEffect(() => {
    if (isInitialized) return
    try {
      const { camera, areaId: urlAreaId } = urlParams.fromUrl()
      if (typeof urlAreaId === 'string' && urlAreaId !== '') setAreaId(urlAreaId)
      if (camera?.center != null) {
        setCenter([camera.center.lng, camera.center.lat])
        setZoom(camera.zoom)
      } else {
        setZoom(DEFAULT_ZOOM)
      }
      setIsInitialized(true)
    } catch (err) {
      setError('Failed to initialize map.')
      setLoading(false)
    }
  }, [urlParams, isInitialized, router])
  const handleMapLoad = useCallback(() => {
    setLoading(false)
    setError(null)
    setErrorDetails(null)
  }, [])
  const handleMapError = useCallback((error?: any) => {
    const errorMessage = 'Error loading map. Please check your network connection and try again.'
    setError(errorMessage)
    setErrorDetails(error?.message ?? 'Unknown error')
    setLoading(false)
    toast.error(errorMessage)
  }, [])
  const handleRetry = useCallback(() => {
    setLoading(true)
    setError(null)
    setErrorDetails(null)
    setIsInitialized(false)
    try {
      const { camera, areaId: urlAreaId } = urlParams.fromUrl()
      if (typeof urlAreaId === 'string' && urlAreaId !== '') setAreaId(urlAreaId)
      if (camera?.center != null) {
        setCenter([camera.center.lng, camera.center.lat])
        setZoom(camera.zoom)
      } else {
        setZoom(DEFAULT_ZOOM)
      }
      setIsInitialized(true)
    } catch (err) {
      handleMapError(err)
    }
  }, [urlParams, handleMapError])

  const handleCameraMovement = useCallback((camera: CameraInfo) => {
  }, [])
  const handleMapClick = useCallback((e: MapLayerMouseEvent) => {
  }, [])
  if (loading) {
    return (
      <div className='w-full h-full flex flex-col items-center justify-center gap-4'>
        <Spinner />
        <div className='text-center'>
          <p className='text-lg font-medium'>Loading climbing areas map...</p>
          <p className='text-sm text-base-content/70'>This may take a few moments</p>
        </div>
      </div>
    )
  }
  if (error != null) {
    return (
      <div className='w-full h-full flex flex-col items-center justify-center p-4 text-center'>
        <div className='bg-error/10 border border-error/30 rounded-lg p-6 max-w-md'>
          <h3 className='text-xl font-bold text-error mb-2'>Map Loading Error</h3>
          <p className='text-base-content mb-4'>{error}</p>

          {errorDetails != null && (
            <div className='bg-base-200 rounded p-3 mb-4 text-left'>
              <p className='font-medium text-sm mb-1'>Error Details:</p>
              <p className='text-xs font-mono break-words'>{errorDetails}</p>
            </div>
          )}
          <div className='flex flex-col sm:flex-row gap-3 justify-center mt-4'>
            <Button
              label='Retry'
              onClick={handleRetry}
              className='btn-primary'
            />
            <Button
              label='Report Issue'
              onClick={() => {
                const errorInfo = `Map Error: ${error}\nDetails: ${errorDetails ?? 'No details'}\nTime: ${new Date().toISOString()}`
                void navigator.clipboard
                  .writeText(errorInfo)
                  .then(() => {
                    toast.info('Error details copied to clipboard. Please contact support@openbeta.io')
                  })
                  .catch(() => {
                    toast.error('Failed to copy error details.')
                  })
              }}
              className='btn-outline'
            />
          </div>
        </div>
      </div>
    )
  }
  return (
    <GlobalMap
      showFullscreenControl={false}
      initialAreaId={areaId}
      initialCenter={center}
      initialZoom={zoom}
      onCameraMovement={handleCameraMovement}
      handleOnClick={handleMapClick}
      onLoad={handleMapLoad}
      onError={handleMapError}
    />
  )
}
