import React, { Dispatch, SetStateAction, useState } from 'react'
import { userMediaStore } from '../../js/stores/media'
import ResponsiveImage, { ResponsiveImage2 } from './slideshow/ResponsiveImage'
import { MobileDialog, DialogContent } from '../ui/MobileDialog'
import { XMarkIcon } from '@heroicons/react/24/outline'
import TagList from './TagList'
import clx from 'classnames'
import { MediaWithTags } from '../../js/types'

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
  console.log('photoList', photoList)

  return (
    <MobileDialog
      modal
      open
      onOpenChange={() => setShowPhotoGalleryModal(false)}
    >
      <DialogContent fullScreen title='Gallery'>
        <div className='px-0 lg:px-4 mt-20 relative columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 lg:gap-4'>
          {photoList.map((mediaWithTags) => {
            const { mediaUrl, width, height, entityTags } = mediaWithTags

            return (
              <div
                data-testid='thumbnail'
                onClick={() => setImageProperties(mediaWithTags)}
                key={mediaUrl}
                className='overflow-hidden mt-0 mb-2 lg:mb-4 hover:brightness-75 break-inside-avoid-column cursor-pointer break-inside-avoid relative block rounded-md'
              >
                <ResponsiveImage2
                  naturalWidth={width}
                  naturalHeight={height}
                  mediaUrl={mediaUrl}
                  isHero={false}
                />
                <div
                  className={
                      clx(
                        entityTags.length === 0
                          ? 'hidden'
                          : 'absolute inset-x-0 bottom-0 p-2 flex items-center bg-base-100 bg-opacity-60'
                      )
                      }
                >
                  <TagList
                    key={mediaUrl}
                    mediaWithTags={mediaWithTags}
                    showDelete
                    showActions={false}
                    showUsernameTag
                  />
                </div>
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
