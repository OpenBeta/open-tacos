import { useState, useCallback } from 'react'
import MobilePage from './MobilePage'

/**
 * Mobile popover component for grades, radius, disciplines selector
 */
export default function MobileFilterPopover ({ btnLabel, title, onApply, children }): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const onCloseHandler = useCallback(() => {
    setIsOpen(false)
    onApply()
  }, [])

  return (
    <div>
      <button
        type='button'
        className='underline text-sm lg:text-base'
        onClick={() => setIsOpen(true)}
      >
        {btnLabel}
      </button>
      <MobilePage
        isOpen={isOpen}
        onClose={onCloseHandler}
        onGoBack={onCloseHandler}
        title={title}
      >
        {children}
      </MobilePage>
    </div>
  )
}

const ContentPanel = ({ children }): JSX.Element => {
  return (
    <div className='relative px-4 py-16'>
      {children}
    </div>
  )
}

MobileFilterPopover.ContentPanel = ContentPanel
