'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { useHotkeys } from 'react-hotkeys-hook'
import { XMarkIcon } from '@heroicons/react/24/outline'
import SharedModal from './Modal'
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
  const router = useRouter()
  const [curIndex, setCurIndex] = useState(currentIndex)

  useEffect(() => {
    if (currentIndex !== curIndex) {
      setCurIndex(currentIndex)
    }
  }, [currentIndex, curIndex])

  const handleClose = useCallback(() => {
    router.back()
  }, [router])

  const changePhotoIdByIndex = useCallback(
    (newIndex: number) => {
      if (newIndex < 0 || newIndex >= images.length) {
        return
      }
      const newPhoto = images[newIndex]
      if (newPhoto?.id !== undefined) {
        const newUrl = `/gallery/p/${uuid}/${newPhoto.id}?type=${type}`
        router.push(newUrl)
      } else {
        console.error('Cannot navigate: New photo or photo ID is undefined at index', newIndex)
      }
    },
    [images, uuid, type, router]
  )

  useHotkeys('arrowright', () => {
    if (curIndex + 1 < images.length) {
      changePhotoIdByIndex(curIndex + 1)
    }
  })

  useHotkeys('arrowleft', () => {
    if (curIndex > 0) {
      changePhotoIdByIndex(curIndex - 1)
    }
  })

  if (images === null || images.length === 0 || curIndex < 0 || curIndex >= images.length) {
    console.warn('PhotoDialogWrapper: Invalid images or currentIndex. Props:', { images, currentIndex })
    return null
  }

  return (
    <Dialog.Root
      open
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose()
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className='fixed inset-0 z-40 bg-black/80 backdrop-blur-sm data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide'
        />
        <Dialog.Content
          className='fixed inset-0 z-50 flex items-center justify-center p-0 data-[state=open]:animate-contentShow data-[state=closed]:animate-contentHide focus:outline-none'
        >
          <SharedModal
            index={curIndex}
            images={images}
            changePhotoId={changePhotoIdByIndex}
            closeModal={handleClose}
            navigation
          />
          <Dialog.Close asChild>
            <button
              className='absolute right-4 top-4 z-[60] inline-flex h-8 w-8 items-center justify-center rounded-full text-white bg-black/40 hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white'
              aria-label='Close dialog'
              title='Close dialog'
            >
              <XMarkIcon className='h-5 w-5' />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
