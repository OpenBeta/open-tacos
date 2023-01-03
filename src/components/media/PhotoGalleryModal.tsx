import React, { Dispatch, SetStateAction } from 'react'
import { userMediaStore } from '../../js/stores/media'
import { ResponsiveImage2 } from './slideshow/ResponsiveImage'
import { MobileDialog, DialogContent } from '../ui/MobileDialog'
// import PhotoFooter from './PhotoFooter';

interface PhotoGalleryModalProps {
  setShowPhotoGalleryModal: Dispatch<SetStateAction<boolean>>
}

/*
 * A reusable popup alert
 * @param setShowPhotoGallery A setState action that toggles the photo gallery modal on click.
 */
const PhotoGalleryModal = ({ setShowPhotoGalleryModal }: PhotoGalleryModalProps): JSX.Element => {
  const photoList = userMediaStore.use.photoList()
  return (
    <MobileDialog modal open onOpenChange={() => setShowPhotoGalleryModal(false)}>
      <DialogContent fullScreen>
        <div className='px-0 lg:px-4 mt-8 relative w-screen w-full mx-auto columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 lg:gap-4'>
          {photoList.map(element => {
            const mediaInfo = element?.mediaInfo
            if (mediaInfo == null) return null
            const { height, width } = mediaInfo?.meta
            return (
              <div
                key={element.mediaUrl}
                className='overflow-hidden mt-0 mb-2 lg:mb-4 hover:brightness-75 break-inside-avoid-column break-inside-avoid relative block rounded-md'
              >
                <ResponsiveImage2
                  naturalWidth={width}
                  naturalHeight={height}
                  mediaUrl={element.mediaUrl}
                  isHero={false}
                />
              </div>
            )
          }
          )}
        </div>
        <div className='h-16'>&nbsp;</div>
      </DialogContent>
    </MobileDialog>
  )
}

export default PhotoGalleryModal
