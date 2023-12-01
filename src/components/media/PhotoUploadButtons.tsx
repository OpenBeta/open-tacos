import { Camera } from '@phosphor-icons/react/dist/ssr'
import BaseUploader from './BaseUploader'

export const UploadPhotoButton: React.FC = () => (
  <BaseUploader className='btn'>
    <Camera size={20} /> <span className='hidden md:inline'>Photo</span>
  </BaseUploader>
)

export const UploadPhotoTextOnlyButton: React.FC = () => (
  <BaseUploader className='btn btn-outline btn-primary'>
    <span>Add photo</span>
  </BaseUploader>
)
