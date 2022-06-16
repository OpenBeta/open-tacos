import { useEffect, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { XIcon, LightBulbIcon } from '@heroicons/react/outline'
import { Dictionary } from 'underscore'

import { MediaType, MediaTagWithClimb } from '../../../js/types'
import { Button, ButtonVariant } from '../../ui/BaseButton'
import TagList from '../TagList'
import AddTag from '../AddTag'
import NextPreviousControl from './NextPreviousControl'
import ResponsiveImage from './ResponsiveImage'
import AddTagCta from './AddTagCta'

interface SimpleModalProps {
  isOpen: boolean
  initialIndex: number
  onTagDeleted: (props?: any) => void
  onTagAdded: (data: any) => void
  onClose: () => void
  imageList: MediaType[]
  tagsByMediaId: Dictionary<MediaTagWithClimb[]>
  userinfo: JSX.Element
  isAuthorized: boolean
}

/**
 * Full screen photo viewer with optional previous and next control.
 */
export default function SlideViewer ({
  isOpen,
  onClose,
  initialIndex,
  imageList,
  tagsByMediaId,
  userinfo,
  isAuthorized,
  onTagDeleted,
  onTagAdded
}: SimpleModalProps): JSX.Element {
  const [currentImageIndex, setCurrentIndex] = useState<number>(initialIndex)

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  const currentImage = imageList[currentImageIndex]

  const tagList = tagsByMediaId?.[currentImage?.mediaId] ?? []

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      as='div'
      className='fixed inset-0 z-10 flex items-center justify-center overflow-y-auto'
    >
      <Dialog.Overlay className='pointer-events-none fixed inset-0 bg-black opacity-60' />
      <Dialog.Panel className='relative flex items-center w-full h-full bg-black max-w-screen-2xl'>
        <div className='block relative w-full h-full aspect-square'>
          {currentImageIndex >= 0 &&
            <ResponsiveImage
              mediaUrl={imageList[currentImageIndex].filename}
              isHero
            />}
        </div>
        <Dialog.Description className='flex flex-col justify-between max-w-[400px] min-w-[350px] h-full w-full bg-white'>
          <div className='px-4 py-6'>
            <div>
              {userinfo}
              <div className='absolute right-3 top-2'>
                <Button
                  label={<XIcon className='w-6 h-6' />}
                  variant={ButtonVariant.ROUNDED_ICON_SOLID}
                  onClick={onClose}
                />
              </div>
            </div>

            <div className='my-8'>
              <div className='text-primary text-sm'>
                Climbs: {tagList.length === 0 && <span className='text-tertiary'>none</span>}
              </div>
              {tagList.length > 0 &&
                <TagList
                  hovered
                  list={tagList}
                  onDeleted={onTagDeleted}
                  isAuthorized={isAuthorized}
                  className='my-2'
                />}
            </div>

            {isAuthorized &&
              <div className='my-8'>
                <div className='text-primary text-sm'>Tag this climb</div>
                <AddTag onTagAdded={onTagAdded} imageInfo={currentImage} className='my-2' />
              </div>}

            {tagList.length === 0 && isAuthorized &&
              <div className='my-8 text-secondary flex items-center space-x-1'>
                <LightBulbIcon className='w-6 h-6 stroke-1 stroke-ob-primary' />
                <span className='mt-1 text-xs'>Your tags help others learn more about the crag</span>
              </div>}
          </div>
          <div className='border-t'>
            {tagList.length === 0 && <AddTagCta />}
          </div>
        </Dialog.Description>
        <NextPreviousControl currentImageIndex={currentImageIndex} setCurrentIndex={setCurrentIndex} imageList={imageList} />
      </Dialog.Panel>
    </Dialog>
  )
}
