import { useState } from 'react'

/**
 * React hook for managing image tagging states
 */
export default function useImageTagHelper (): any {
  /* Info of the image being clicked on */
  const [imageInfo, setImageInfo] = useState(null)

  /* Screen coordinates of click event */
  const [mouseXY, _setMouseXY] = useState([0, 0])

  /* search popover state */
  const [isOpen, setIsOpen] = useState<boolean>(false)

  /**
   * Record onClick event on image and screen X, Y
   */
  const onClick = ({ imageInfo, mouseXY }): void => {
    setImageInfo(imageInfo)
    _setMouseXY(mouseXY)
    setIsOpen(true)
  }

  /**
   * Close/cancel active popover climb search widget
   */
  const close = (): void => {
    setIsOpen(false)
  }

  return {
    close,
    isOpen,
    mouseXY: [mouseXY[0], mouseXY[1]],
    onClick,
    imageInfo
  }
}
