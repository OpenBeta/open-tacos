import { useState } from 'react'
import { useRouter } from 'next/router'
import { CameraIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

import UploadPhotoTrigger from '../UploadPhotoTrigger'
import PhotoUploader from './PhotoUploader'

interface UploadCTAProps {
  onUploadFinish: (url: string) => Promise<void>
}

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
export default function UploadCTA ({ onUploadFinish }: UploadCTAProps): JSX.Element {
  return (
    <PhotoUploader
      onUploaded={onUploadFinish}
      className='relative aspect-video mt-8 md:mt-0 lg:aspect-auto
      lg:w-[300px] lg:h-[300px] rounded-lg bg-neutral-200 border-neutral-300
      border-2 border-dashed flex items-center justify-center cursor-pointer
      hover:brightness-75 overflow-hidden'
    >
      <div className='flex flex-col items-center'>
        <CameraIcon className='stroke-gray-400 stroke-1 w-24 h-24' />
        <span className='text-secondary text-sm'>Click to upload</span>
      </div>
    </PhotoUploader>
  )
}

/**
 * A Call-to-action banner to encourage photo upload to crags without photos
 */
export const UploadCTACragBanner: React.FC = () => {
  const router = useRouter()
  const [uploaded, setUploaded] = useState(false)
  return (
    <section className='fadeinEffect p-4 rounded-box bg-secondary/50 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 h-48'>
      {uploaded
        ? (
          <div className='text-center'>
            <div className='text-lg font-semibold'>Thank you for your contribution!</div>
            <div className='text-sm  text-base-300'>Click&nbsp;
              <span
                role='button'
                className='underline'
                onClick={() => {
                  void router.replace(router.asPath)
                }}
              >here
              </span>&nbsp;if you don't see the photo.
            </div>
          </div>)
        : (
          <>
            <div className='text-center lg:text-left'>
              <div className='text-lg'><strong>No photos found.  Be the first to help improve this crag!</strong></div>
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
          </>)}
    </section>

  )
}
