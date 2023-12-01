import { Camera } from '@phosphor-icons/react/dist/ssr'
import { BaseUploaderWithNext13Context } from './BaseUploader'

export const UploadPhotoButton: React.FC = () => (
  <BaseUploaderWithNext13Context className='btn'>
    <Camera size={20} /> <span className='hidden md:inline'>Photo</span>
  </BaseUploaderWithNext13Context>
)

export const UploadPhotoTextOnlyButton: React.FC = () => (
  <BaseUploaderWithNext13Context className='btn btn-outline btn-primary'>
    <span>Add photo</span>
  </BaseUploaderWithNext13Context>
)
