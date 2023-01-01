import React, { Dispatch, ReactNode, SetStateAction } from 'react'
import { userMediaStore } from '../../js/stores/media'
import { ResponsiveImage2 } from './slideshow/ResponsiveImage'
import { MobileDialog, DialogContent } from '../ui/MobileDialog'
// import { urlResolver } from '../../js/utils';
// import { DefaultLoader, MobileLoader } from '../../js/sirv/util';
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
      <DialogContent title={title}>

        <div className='p-4 rounded-box bg-base-100 w-full h-full'>
          <div className='gap-8 columns-2 md:px-4 md:columns-2 lg:columns-3 xl:columns-3 2xl:columns-4 rounded-box'>
            {photoList.map(element => {
              return (
                <div
                  key={element.mediaUrl}
                  className='hover:brightness-75 mb-4 rounded-md overflow-hidden'
                // className='break-inside-avoid-column break-inside-avoid'
                >
                  {/* <Link href={element.mediaUrl}> */}
                  <ResponsiveImage2 naturalWidth={250} naturalHeight={250} mediaUrl={element.mediaUrl} isHero={false} />
                  {/* </Link> */}
                </div>
              )
            }
            )}
          </div>
        </div>

      </DialogContent>
    </MobileDialog>
  )
}

export default PhotoGalleryModal
