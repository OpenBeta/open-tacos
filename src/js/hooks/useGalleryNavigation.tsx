'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useHotkeys } from 'react-hotkeys-hook'

interface UseGalleryNavigationProps {
  imageCount: number
  onIndexChange?: (index: number) => void
  isMobile?: boolean
}

/**
 * Hook for managing gallery carousel navigation, keyboard shortcuts, and state
 */
export function useGalleryNavigation ({
  imageCount,
  onIndexChange,
  isMobile = false
}: UseGalleryNavigationProps): {
    currentIndex: number
    goToPrevious: () => void
    goToNext: () => void
    goToIndex: (index: number) => void
    closeGallery: () => void
  } {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + imageCount) % imageCount)
  }, [imageCount])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % imageCount)
  }, [imageCount])

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < imageCount) {
      setCurrentIndex(index)
    }
  }, [imageCount])

  const closeGallery = useCallback(() => {
    router.back()
  }, [router])

  // Update callback when index changes
  useEffect(() => {
    onIndexChange?.(currentIndex)
  }, [currentIndex, onIndexChange])

  // Keyboard shortcuts (disabled on mobile)
  useHotkeys(
    'ArrowLeft',
    () => {
      if (!isMobile) goToPrevious()
    },
    { enabled: !isMobile }
  )

  useHotkeys(
    'ArrowRight',
    () => {
      if (!isMobile) goToNext()
    },
    { enabled: !isMobile }
  )

  useHotkeys(
    'Escape',
    () => {
      closeGallery()
    }
  )

  return {
    currentIndex,
    goToPrevious,
    goToNext,
    goToIndex,
    closeGallery
  }
}
