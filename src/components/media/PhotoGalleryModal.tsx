import React, { Dispatch, SetStateAction,useState } from 'react'
import { userMediaStore } from '../../js/stores/media'
import { ResponsiveImage2 } from './slideshow/ResponsiveImage'
import ResponsiveImage  from "./slideshow/ResponsiveImage";
import { MobileDialog, DialogContent } from '../ui/MobileDialog'

interface PhotoGalleryModalProps {
  setShowPhotoGalleryModal: Dispatch<SetStateAction<boolean>>
}

/*
 * A reusable popup alert
 * @param setShowPhotoGallery A setState action that toggles the photo gallery modal on click.
 */
const PhotoGalleryModal = ({ setShowPhotoGalleryModal }: PhotoGalleryModalProps): JSX.Element => {
    const [ShowImage, setShowImage] = useState('')
  const photoList = userMediaStore.use.photoList()
  return (
    <MobileDialog modal open onOpenChange={() => setShowPhotoGalleryModal(false)}>
      <DialogContent fullScreen title='Gallery'>
        <div className='px-0 lg:px-4 mt-20 relative columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 lg:gap-4'>
          {photoList.map(element => {
            const mediaInfo = element?.mediaInfo
            if (mediaInfo == null) return null
            const { height, width } = mediaInfo?.meta
            return (
              <div
                 onClick={() => {
                  setShowImage(element.mediaUrl), console.log(element.mediaUrl);
                }}
                key={element.mediaUrl}
                className='overflow-hidden mt-0 mb-2 lg:mb-4 hover:brightness-75 break-inside-avoid-column cursor-pointer break-inside-avoid relative block rounded-md'
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
           {
        ShowImage ? ( 
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative w-full h-full">
              <div className="absolute top-2 right-2 z-50">
                <button
                  onClick={() => setShowImage('')}
                  className="bg-white hover:bg-gray-500 bg-opacity-50 rounded-full  duration-300 ease-in-out p-2"
                >
                  <svg

                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-center h-full">

          <ResponsiveImage
            mediaUrl={ShowImage}
            isHero={false}
          />

              </div>
            </div>
          </div>
        ) : null

     }
        <div className='h-16'>&nbsp;</div>
      </DialogContent>
    </MobileDialog>
  )
}

export default PhotoGalleryModal
