'use client'

import React from 'react'
import SlideViewer from './SlideViewer'
import { MediaWithTags } from '@/js/types'
import { WithPermission } from '@/js/types/User'

interface PhotoDialogWrapperProps {
  images: MediaWithTags[]
  currentIndex: number
  uuid: string
  type: 'area' | 'climb'
  entityName?: string
  userinfoData: { name?: string }
  authData: WithPermission
}

export default function PhotoDialogWrapper ({
  images,
  currentIndex,
  uuid,
  type,
  entityName,
  userinfoData,
  authData
}: PhotoDialogWrapperProps): JSX.Element | null {
  const userinfoElement = (userinfoData?.name != null && userinfoData.name !== '') ? <span>Uploaded by: {userinfoData.name}</span> : <></>
  const dialogTitleForSlideViewer = (entityName != null && entityName !== '') ? entityName : undefined

  if (images == null || images.length === 0) {
    return (
      <SlideViewer
        initialIndex={-1}
        imageList={[]}
        userinfo={userinfoElement}
        auth={authData}
        galleryType={type}
        dialogTitle={dialogTitleForSlideViewer != null ? dialogTitleForSlideViewer : 'Gallery Error'}
        uuid={uuid}
      />
    )
  }

  return (
    <SlideViewer
      initialIndex={currentIndex}
      imageList={images}
      userinfo={userinfoElement}
      auth={authData}
      galleryType={type}
      dialogTitle={dialogTitleForSlideViewer}
      uuid={uuid}
    />
  )
}
