'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface GalleryModalOpenerProps {
  uuid: string
  photoId?: string
  type: 'area' | 'climb'
}

export default function GalleryModalOpener ({ uuid, photoId, type }: GalleryModalOpenerProps): null {
  const router = useRouter()

  useEffect(() => {
    if (photoId != null) {
      router.push(`/gallery/${uuid}/modal/${photoId}?type=${type}`)
    }
  }, [uuid, photoId, type, router])

  return null
}
