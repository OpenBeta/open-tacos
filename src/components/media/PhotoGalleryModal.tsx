import React, { Dispatch, ReactNode, SetStateAction } from 'react'
import { userMediaStore } from '../../js/stores/media'
import { ResponsiveImage2 } from './slideshow/ResponsiveImage'
import { MobileDialog, DialogContent } from '../ui/MobileDialog'
// import PhotoFooter from './PhotoFooter';

interface LeanAlertProps {
  closeOnEsc?: boolean // prevent Esc to close alert
  icon?: ReactNode
  title: ReactNode
  description: ReactNode
  children?: ReactNode
  setShowPhotoGalleryModal: Dispatch<SetStateAction<boolean>>
}

/*
 * A reusable popup alert
 * @param title
 * @param description
 * @param setShowPhotoGallery A setState action that toggles the photo gallery modal on click.
 */
const PhotoGalleryModal = ({ title, description, setShowPhotoGalleryModal }: LeanAlertProps): JSX.Element => {
  const photoList = userMediaStore.use.photoList()
  return (
    <MobileDialog modal open onOpenChange={() => setShowPhotoGalleryModal(false)}>
      <DialogContent title={title} fullScreen>
        <div className='px-0 lg:px-4 mt-8 relative w-screen w-full mx-auto columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 lg:gap-4'>
          {photoList.map(element => {
            const mediaInfo = element?.mediaInfo
            if (mediaInfo == null) return null
            const { height, width } = mediaInfo?.meta
            return (
              <div
                key={element.mediaUrl}
                className='overflow-hidden mt-0 mb-2 lg:mb-4 hover:brightness-75 break-inside-avoid-column break-inside-avoid relative block'
              >
                {/* <Link href={element.mediaUrl}> */}
                <ResponsiveImage2
                  naturalWidth={width}
                  naturalHeight={height}
                  mediaUrl={element.mediaUrl}
                  isHero={false}
                />
                {/* </Link> */}
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
