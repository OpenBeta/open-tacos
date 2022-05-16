import { useState } from 'react'

/**
 * React hook for managing tagging UI states
 */
export default function useImageTagHelper (): any {
  const [imageInfo, setImageInfo] = useState(null)
  const [mouseXY, _setMouseXY] = useState([0, 0])
  const [isOpen, setIsOpen] = useState(true)

  const onClick = ({ imageInfo, mouseXY }): void => {
    setImageInfo(imageInfo)
    _setMouseXY(mouseXY)
    setIsOpen(true)
  }

  /**
   * Close/cancel in-process climb search
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
