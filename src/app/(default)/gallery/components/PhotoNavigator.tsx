'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface PhotoNavigatorProps {
  prevPhotoUrl?: string
  nextPhotoUrl?: string
}

export default function PhotoNavigator ({ prevPhotoUrl, nextPhotoUrl }: PhotoNavigatorProps): null {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'ArrowLeft' && (prevPhotoUrl != null)) {
        event.preventDefault()
        router.push(prevPhotoUrl)
      } else if (event.key === 'ArrowRight' && (nextPhotoUrl != null)) {
        event.preventDefault()
        router.push(nextPhotoUrl)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [prevPhotoUrl, nextPhotoUrl, router])

  return null
}
