import { CameraIcon } from '@heroicons/react/outline'
import PhotoUploader from './PhotoUploader'

interface UploadCTAProps {
  onUploadFinish: (url: string) => Promise<void>
}

/**
 * A photo upload Call-to-action button
 */
export default function UploadCTA ({ onUploadFinish }: UploadCTAProps): JSX.Element {
  return (
    <PhotoUploader
      onUploaded={onUploadFinish}
      className='block relative aspect-video lg:aspect-auto lg:w-[300px] lg:h-[300px] rounded-lg bg-neutral-100 border-neutral-300 border-2 border-dashed flex items-center justify-center cursor-pointer hover:brightness-75 overflow-hidden'
    >
      <div className='flex flex-col items-center'>
        <CameraIcon className='stroke-gray-400 stroke-1 w-24 h-24' />
        <span className='text-secondary text-sm'>Click to upload</span>
      </div>
    </PhotoUploader>
  )
}
