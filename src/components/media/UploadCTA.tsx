import { CameraIcon } from '@heroicons/react/24/outline'
import { BaseUploader } from './BaseUploader'

/**
 * A photo upload Call-to-action button in user gallery.
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
    <BaseUploader
      className='relative aspect-video mt-8 md:mt-0 lg:aspect-auto
      lg:w-[300px] lg:h-[300px] rounded-box
      border-2 border-base-content/80 border-dashed flex items-center justify-center cursor-pointer
       overflow-hidden'
    >
      <div className='flex flex-col items-center'>
        <CameraIcon className='w-24 h-24 text-base-content/80' />
        <span className='text-base-content text-sm'>Click to upload</span>
      </div>
    </BaseUploader>
  )
}
