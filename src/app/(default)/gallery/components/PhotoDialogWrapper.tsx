'use client'

import React, { useState, useEffect } from 'react'
import SlideViewer from './SlideViewer'
import { MediaWithTags } from '@/js/types'

interface PhotoDialogWrapperProps {
  images: MediaWithTags[]
  currentIndex: number
  uuid: string
  type: 'area' | 'climb'
}

export default function PhotoDialogWrapper ({
  images,
  currentIndex,
  uuid,
  type
}: PhotoDialogWrapperProps): JSX.Element | null {
  const [curIndex, setCurIndex] = useState(currentIndex)

  useEffect(() => {
    if (currentIndex !== curIndex) {
      setCurIndex(currentIndex)
    }
  }, [currentIndex, curIndex])

  return (
    <SlideViewer
      initialIndex={curIndex}
      imageList={images}
      userinfo={<></>} // Placeholder for user info component
      auth={{
        isAuthorized: false,
        isAuthenticated: false
      }} // Placeholder for auth component
      galleryType={type}
      dialogTitle={`Photo ${curIndex + 1} of ${images.length}`}
      uuid={uuid}
    />
  )
}
