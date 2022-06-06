import { CameraIcon } from '@heroicons/react/outline'
import PhotoUploader from './PhotoUploader'

interface InitialUploadCTAProps {
  onUploadFinish: (url: string) => Promise<void>
}

/**
 * A photo upload Call-to-action button
 */
export default function InitialUploadCTA ({ onUploadFinish }: InitialUploadCTAProps): JSX.Element {
  return (
    <PhotoUploader
      onUploaded={onUploadFinish}
      className='block relative w-[300px] h-[300px] rounded-lg bg-neutral-100 border-neutral-300 border-2 border-dashed flex items-center justify-center cursor-pointer'
    >
      <div className='flex flex-col items-center'>
        <CameraIcon className='stroke-gray-400 stroke-1 w-24 h-24' />
        <span className='text-secondary text-sm'>Click to upload</span>
      </div>
    </PhotoUploader>
  )
}
