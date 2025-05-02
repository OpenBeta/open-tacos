import React, { Dispatch, SetStateAction, useState } from 'react'
import Link from 'next/link'
import { userMediaStore } from '../../js/stores/media'
import ResponsiveImage, { FixedWidthImageContainer } from './slideshow/ResponsiveImage'
import { MobileDialog, DialogContent } from '../ui/MobileDialog'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface PhotoGalleryModalProps {
  userName: string | null
  setShowPhotoGalleryModal: Dispatch<SetStateAction<boolean>>
}

/*
 * A reusable popup alert
 * @param setShowPhotoGallery A setState action that toggles the photo gallery modal on click.
 */
const PhotoGalleryModal = ({
  userName = null,
  setShowPhotoGalleryModal
}: PhotoGalleryModalProps): JSX.Element => {
  const [ShowImage, setShowImage] = useState('')
  const photoList = userMediaStore.use.photoList()
  return (
    <MobileDialog
      modal
      open
      onOpenChange={() => setShowPhotoGalleryModal(false)}
    >
      <DialogContent fullScreen title='Gallery'>
        <div className='px-0 lg:px-4 mt-20 relative columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 lg:gap-4'>
          {photoList.map((element) => {
            const { mediaUrl, width, height } = element
            return (
              <div
                onClick={() => setShowImage(element.mediaUrl)}
                key={element.mediaUrl}
                className='overflow-hidden mt-0 mb-2 lg:mb-4 hover:brightness-75 break-inside-avoid-column cursor-pointer break-inside-avoid relative block rounded-md'
              >
                <FixedWidthImageContainer
                  desiredWidth={300}
                  naturalWidth={width}
                  naturalHeight={height}
                  mediaUrl={mediaUrl}
                />
              </div>
            )
          })}
        </div>

        {
        ShowImage !== ''
          ? (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75'>
              <div className='relative w-full h-full'>
                {/* Close button */}
                <div className='absolute top-2 right-2 z-50'>
                  <button
                    onClick={() => setShowImage('')}
                    className='bg-white hover:bg-gray-500 bg-opacity-50 rounded-full duration-300 ease-in-out p-2'
                    title='Close'
                  >
                    <XMarkIcon className='w-6 h-6' />
                  </button>
                </div>
                {/* Centered Image */}
                <div className='flex items-center justify-center h-full'>
                  <ResponsiveImage mediaUrl={ShowImage} isHero={false} sizes='100vw' />
                </div>
                {/* Username Badge in Bottom Left */}
                {Boolean(userName) && (
                  <Link
                    href={userName !== null && userName.trim() !== '' ? `/u/${userName}` : '#'}
                    prefetch={false}
                    className='absolute bottom-4 right-4 badge max-w-full z-10 badge-info bg-opacity-60 hover:bg-opacity-90'
                  >
                    <div className='mt-0.5 whitespace-nowrap truncate text-sm'>
                      📸 {userName}
                    </div>
                  </Link>
                )}
              </div>
            </div>
            )
          : null
        }

      </DialogContent>
    </MobileDialog>
  )
}

export default PhotoGalleryModal
