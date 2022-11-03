import { CameraIcon } from '@heroicons/react/24/outline'
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
