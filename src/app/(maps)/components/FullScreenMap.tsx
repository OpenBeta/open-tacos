'use client'
import { useEffect, useState } from 'react'
import { GlobalMap } from '@/components/maps/GlobalMap'

export const FullScreenMap: React.FC = () => {
  const [initialCenter, setInitialCenter] = useState<[number, number] | undefined>(undefined)

  useEffect(() => {
    getVisitorLocation().then((visitorLocation) => {
      if (visitorLocation != null) {
        setInitialCenter([visitorLocation.longitude, visitorLocation.latitude])
      }
    }).catch(() => {
      console.log('Unable to determine user\'s location')
    })
  }, [])

  return (
    <GlobalMap
      showFullscreenControl={false}
      initialCenter={initialCenter}
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
