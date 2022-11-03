import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useHotkeys } from 'react-hotkeys-hook'

import { Button, ButtonVariant } from '../../ui/BaseButton'

interface NavBarProps {
  currentImageIndex: number
  onChange: (newIndex: number) => void
  max: number
}

export default function NextPreviousControl ({ currentImageIndex, onChange, max }: NavBarProps): JSX.Element {
  useHotkeys('left', () => {
    if (currentImageIndex > 0) {
      onChange(currentImageIndex - 1)
    }
  }, [currentImageIndex])
  useHotkeys('right', () => {
    if (currentImageIndex < max) {
      onChange(currentImageIndex + 1)
    }
  }, [currentImageIndex])
  return (
    <div className='absolute w-full flex items-center justify-between px-2'>
      {currentImageIndex > 0
        ? <Button
            ariaLabel='previous'
            label={<ChevronLeftIcon className='w-8 h-8' />}
            variant={ButtonVariant.ROUNDED_ICON_SOLID}
            onClick={() => onChange(currentImageIndex - 1)}
          />
        : <div />}
      {currentImageIndex < max
        ? <Button
            ariaLabel='next'
            label={<ChevronRightIcon className='w-8 h-8 ' />}
            variant={ButtonVariant.ROUNDED_ICON_SOLID}
            onClick={() => onChange(currentImageIndex + 1)}
          />
        : <div />}
    </div>
  )
}
