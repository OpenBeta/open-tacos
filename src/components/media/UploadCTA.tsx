import { useState } from 'react'
import { useRouter } from 'next/router'
import { CameraIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import clx from 'classnames'

import UploadPhotoTrigger from '../UploadPhotoTrigger'
import PhotoUploader from './PhotoUploader'
import Link from 'next/link'

/**
 * A photo upload Call-to-action button
 *
 * The user should be able to click this, with the intended action being to open
 * a file explorer for them to select a photo to upload.
 *
 * The user should also be able to simply drag-and-drop a photo over this zone,
 * which should trigger the upload.
 *
 * If a user selects / drags multiple, they should be all be uploaded (weather sequentially
 * or asynchronously).
 */
export default function UploadCTA (): JSX.Element {
  return (
    <PhotoUploader
      className='relative aspect-video mt-8 md:mt-0 lg:aspect-auto
      lg:w-[300px] lg:h-[300px] rounded-box
      border-2 border-base-content/80 border-dashed flex items-center justify-center cursor-pointer
       overflow-hidden'
    >
      <div className='flex flex-col items-center'>
        <CameraIcon className='w-24 h-24 text-base-content/80' />
        <span className='text-base-content text-sm'>Click to upload</span>
      </div>
    </PhotoUploader>
  )
}

interface UploadCTACragBannerProps {
  isSkeleton?: boolean
}
/**
 * A Call-to-action banner to encourage photo upload to crags without photos
 */
export const UploadCTACragBanner: React.FC<UploadCTACragBannerProps> = ({ isSkeleton = false }) => {
  const router = useRouter()
  const [uploaded, setUploaded] = useState(false)
  return (
    <section className={clx('p-4 rounded-box flex flex-wrap items-center justify-center gap-x-8 gap-y-2 h-48', isSkeleton ? 'animate-pulse bg-base-200/10' : 'bg-secondary/50')}>
      {!isSkeleton && uploaded &&
         (
           <div className='text-center'>
             <div className='text-lg font-semibold'>Thank you for your contribution!</div>
             <div className='text-sm text-base-300'>Photos will be added momentarily.  Click&nbsp;
               <Link href={router.asPath}>
                 <a className='underline'>here</a>
               </Link>
              &nbsp;to manually refresh the page.
             </div>
           </div>)}
      {!isSkeleton && !uploaded && (
        <>
          <div className='text-center lg:text-left'>
            <div className='text-lg'><strong>No photos found.  Be the first to help improve this page!</strong></div>
            <div className='text-base-300 text-sm max-w-sm'>Your photos inspire others and help them learn more about this climbing area.</div>
          </div>
          <div className='hidden lg:block'>
            <ArrowRightIcon className='w-5 h-5' />
          </div>
          <UploadPhotoTrigger onUploaded={() => setUploaded(true)}>
            <button className='btn btn-primary btn-solid gap-2 btn-wide btn-sm'>
              <CameraIcon className='w-6 h-6' /> Add Photos
            </button>
          </UploadPhotoTrigger>
        </>
      )}
    </section>
  )
}
