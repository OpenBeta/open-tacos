import { Plus, Camera } from '@phosphor-icons/react/dist/ssr'
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
          <Plus size={24} />
          <span className='hidden xl:inline mt-0.5'>Photo</span>
        </button>
      </div>
    </UploadPhotoTrigger>
  )
}

export const UploadPhotoButton: React.FC = () => (
  <UploadPhotoTrigger>
    <div className='btn'><Camera size={20} /> Photo</div>
  </UploadPhotoTrigger>
)

export const UploadPhotoTextOnlyButton: React.FC = () => (
  <UploadPhotoTrigger>
    <div className='btn btn-outline btn-primary'>Add photo</div>
  </UploadPhotoTrigger>
)
