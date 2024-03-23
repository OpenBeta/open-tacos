'use client'
import { useEffect, useState } from 'react'
import { GlobalMap, GlobalMapSkeleton } from '@/components/maps/GlobalMap'
import { useSearchParams } from 'next/navigation'

export const FullScreenMap: React.FC = () => {
  const [initialCenter, setInitialCenter] = useState<[number, number] | undefined>(undefined)
  const [initialZoom, setInitialZoom] = useState<number | undefined>(undefined)
  const searchParams = useSearchParams()
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (searchParams.has('center') && searchParams.has('zoom')) {
      const centerParam = searchParams.get('center')
      const zoomParam = searchParams.get('zoom')
      if (centerParam !== null && centerParam !== '' && zoomParam !== null && zoomParam !== '') {
        const [lat, lng] = centerParam.split(',').map(Number)
        setInitialCenter([lng, lat])
        setInitialZoom(Number(zoomParam))
      }
      setMapLoaded(true)
    } else {
      getVisitorLocation().then((visitorLocation) => {
        if (visitorLocation != null) {
          setInitialCenter([visitorLocation.longitude, visitorLocation.latitude])
        }
        setMapLoaded(true)
      }).catch(() => {
        console.log('Unable to determine user\'s location')
        setMapLoaded(true)
      })
    }
  }, [])

  if (!mapLoaded) {
    return <GlobalMapSkeleton />
  }

  return (
    <GlobalMap
      showFullscreenControl={false}
      initialCenter={initialCenter}
      initialZoom={initialZoom}
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
