import { Dispatch, SetStateAction } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'

import { MediaType } from '../../../js/types'
import { Button, ButtonVariant } from '../../ui/BaseButton'

interface NavBarProps {
  currentImageIndex: number
  setCurrentIndex: Dispatch<SetStateAction<number>>
  imageList: MediaType[]
}

export default function NextPreviousControl ({ currentImageIndex, setCurrentIndex, imageList }: NavBarProps): JSX.Element {
  return (
    <div className='absolute w-full flex items-center justify-between px-2'>
      {currentImageIndex > 0
        ? <Button
          label={<ChevronLeftIcon className='w-8 h-8' />}
          variant={ButtonVariant.ROUNDED_ICON_SOLID}
          onClick={() => setCurrentIndex(current => (current - 1))}
          />
        : <div />}
      {currentImageIndex < imageList.length - 1
        ? <Button
          label={<ChevronRightIcon className='w-8 h-8 ' />}
          variant={ButtonVariant.ROUNDED_ICON_SOLID}
          onClick={() => setCurrentIndex(current => (current + 1))}
          />
        : <div />}
    </div>
  )
}
