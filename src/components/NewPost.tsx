import { PlusIcon } from '@heroicons/react/24/outline'

import UploadPhotoTrigger from '../components/UploadPhotoTrigger'
interface ProfileNavButtonProps {
  isMobile?: boolean
  className?: string
}

export default function NewPost ({ isMobile = true, className = '' }: ProfileNavButtonProps): JSX.Element | null {
  return (
    <UploadPhotoTrigger>
      {/* make button wide on large desktop */}
      <div className='xl:w-32 z-50'>
        <button className='btn btn-accent btn-sm lg:btn-solid gap-2 xl:btn-md xl:btn-block'>
          <PlusIcon className='stroke-white stroke-2 w-6 h-6' />
          <span className='hidden xl:inline mt-0.5'>Photo</span>
        </button>
      </div>
    </UploadPhotoTrigger>
  )
}
