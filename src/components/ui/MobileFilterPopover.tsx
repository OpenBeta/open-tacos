import { useState } from 'react'
import MobilePage from './MobilePage'

/**
 * Mobile popover component for grades, radius, disciplines selector
 */
export default function MobileFilterPopover ({ btnLabel, title, onApply, children }): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const onCloseHandler = (): void => {
    setIsOpen(false)
    onApply()
  }

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
    <>
      {children}
    </>
  )
}

MobileFilterPopover.ContentPanel = ContentPanel
