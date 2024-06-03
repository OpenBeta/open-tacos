import { useResponsive } from '@/js/hooks'
import * as Popover from '@radix-ui/react-popover'
import { useCallback } from 'react'
import { MapInstance } from 'react-map-gl'

interface CoordinatePickerPopupProps {
  info: {
    coordinates: { lng: number, lat: number }
    mapInstance: MapInstance | null
  }
  onConfirm: () => void
  onClose: () => void
  open: boolean
}

export const CoordinatePickerPopup: React.FC<CoordinatePickerPopupProps> = ({ info, onConfirm, onClose, open }) => {
  const { coordinates, mapInstance } = info
  const { lng: longitude, lat: latitude } = coordinates
  const screenXY = mapInstance?.project(coordinates)
  const { isMobile } = useResponsive()

  const handleConfirmClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onConfirm()
  }, [onConfirm])

  if (screenXY == null) return null

  const anchorClass = isMobile
    ? 'fixed top-15 left-1/2 transform -translate-x-1/2'
    : 'fixed top-1/4 left-1/2 transform -translate-x-1/2'

  return (
    <Popover.Root open={open}>
      <Popover.Anchor className={anchorClass} />
      <Popover.Content
        align='center'
        side='top'
        sideOffset={8}
        collisionPadding={24}
        className='z-50 focus:outline-none cursor-pointer p-4 bg-white rounded shadow-md'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='text-center'>
          <p className='text-sm'>Coordinates: {latitude.toFixed(5)}, {longitude.toFixed(5)}</p>
          <div className='flex justify-center mt-2'>
            <button
              className='btn btn-primary mr-2'
              onClick={handleConfirmClick}
            >
              Confirm
            </button>
            <button
              className='btn btn-secondary'
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  )
}
