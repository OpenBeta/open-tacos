import { ReactElement } from 'react'
import TagList from '@/components/media/TagList'
import { LightBulbIcon } from '@heroicons/react/24/outline'
import { MediaWithTags } from '@/js/types'
import { WithPermission } from '@/js/types/User'
import { useResponsive } from '@/js/hooks'

interface InfoContainerProps {
  currentImage: MediaWithTags | null
  auth: WithPermission
  keyboardTip?: boolean
  onClose?: () => void
}

export const InfoContainer = ({ currentImage, auth, keyboardTip = true, onClose }: InfoContainerProps): ReactElement | null => {
  const { isMobile } = useResponsive()
  if (currentImage == null) return null

  const { entityTags } = currentImage
  const tagCount = entityTags.length
  return (
    <>
      <div className='my-8'>
        <div className='text-primary text-sm'>
          Tags: {tagCount === 0 && <span className='text-tertiary'>none</span>}
        </div>
        {tagCount > 0 &&
          <TagList
            mediaWithTags={currentImage}
            {...auth}
            showDelete
            className='my-2'
          />}
      </div>

      {tagCount === 0 &&
        <div className='my-8 text-secondary flex items-center space-x-1'>
          <LightBulbIcon className='w-6 h-6 stroke-1 stroke-ob-primary' />
          <span className='mt-1 text-xs'>Your tags help others learn more about the crag</span>
        </div>}

      <div className='flex-1' />
      {!isMobile && keyboardTip &&
        <div className='mb-2 flex flex-col gap-4 text-sm text-base-300 font-semibold'>
          <div> Keyboard shortcuts:</div>
          <div className='flex flex-col gap-2'>
            <span><kbd className='mr-2 kbd'>◀︎</kbd>PREVIOUS</span>
            <span><kbd className='mr-2 kbd'>▶︎</kbd>NEXT</span>
          </div>
        </div>}
      {auth.isAuthorized &&
        <div className='my-8 flex items-center hover:bg-rose-50 p-2 rounded-lg transition'>
          <div className='text-primary text-sm flex-1'>Enable <b>Power mode</b> to delete this image</div>
        </div>}
    </>
  )
}
