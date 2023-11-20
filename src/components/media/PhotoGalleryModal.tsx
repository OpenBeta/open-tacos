import React, { Dispatch, SetStateAction, useState } from 'react'
import { userMediaStore } from '../../js/stores/media'
import ResponsiveImage from './slideshow/ResponsiveImage'
import { MobileDialog, DialogContent } from '../ui/MobileDialog'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { MediaWithTags } from '../../js/types'
import { GalleryImageCard } from './GalleryImageCard'

export interface PhotoGalleryModalProps {
  setShowPhotoGalleryModal: Dispatch<SetStateAction<boolean>>
}

/*
 * A modal component that displays a photo gallery.
 * @param setShowPhotoGallery A setState action that toggles the photo gallery modal on click.
 */
const PhotoGalleryModal = ({
  setShowPhotoGalleryModal
}: PhotoGalleryModalProps): JSX.Element => {
  // State to keep track of the image details being viewed in full screen.
  const [imageProperties, setImageProperties] = useState<MediaWithTags | null>(null)

  // Fetch the list of photos.
  const photoList = userMediaStore.use.photoList()

  return (
    <MobileDialog
      modal
      open
      onOpenChange={() => setShowPhotoGalleryModal(false)}
    >
      <DialogContent fullScreen title='Gallery'>
        <div className='px-0 lg:px-4 mt-20 relative columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 lg:gap-4'>
          {photoList.map((mediaWithTags) => {
            return (
              <div
                data-testid='thumbnail'
                onClick={() => setImageProperties(mediaWithTags)}
                key={mediaWithTags.mediaUrl}
                className='overflow-hidden hover:brightness-75 break-inside-avoid-column cursor-pointer relative block rounded-md mb-4'
              >
                <GalleryImageCard key={mediaWithTags.mediaUrl} mediaWithTags={mediaWithTags} onImageClick={() => setImageProperties(mediaWithTags)} />
              </div>
            )
          })}
        </div>

        {/* Full-screen view of selected image */}
        {
        (imageProperties != null) && imageProperties.mediaUrl !== ''
          ? (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75'>
              <div className='relative w-full h-full'>
                <div className='absolute top-2 right-2 z-50'>
                  <button
                    data-testid='close-fullscreen-button'
                    onClick={() => setImageProperties(null)}
                    className='bg-white hover:bg-gray-500 bg-opacity-50 rounded-full  duration-300 ease-in-out p-2'
                  >
                    <XMarkIcon className='w-6 h-6' />
                  </button>
                </div>
                <div className='flex items-center justify-center h-full'>
                  <ResponsiveImage mediaUrl={imageProperties.mediaUrl} isHero={false} />
                </div>
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
