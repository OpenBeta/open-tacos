import { useState } from 'react'
import MobilePage from './MobilePage'

/**
 * Mobile popover component for grades, radius, disciplines selector
 */
export default function MobileFilterPopover ({ mobileLabel, btnLabel, title, onApply, children }): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const onCloseHandler = (): void => {
    setIsOpen(false)
    onApply()
  }

  return (
    <div>
      <button
        type='button'
        className='border rounded-lg border-neutral-300 px-4 py-1.5 text-xs lg:text-sm whitespace-nowrap'
        onClick={() => setIsOpen(true)}
      >
        <span className='sm:hidden'>
          {mobileLabel}
        </span>
        <span className='hidden sm:inline'>{btnLabel}</span>
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
