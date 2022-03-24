import { Popover } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

/**
 * Barebone popover component
 * @param
 * @returns
 */
const LeanPopover = ({ btnClz, btnLabel, children }): JSX.Element => {
  return (
    <Popover className=''>
      {({ open }) => (
        <>
          <Popover.Button className={btnClz}>
            <span>{btnLabel}</span>
            <div className='w-4 h-4'><ChevronDownIcon className={`text-white ${open ? 'transform rotate-180' : ''}`} /></div>
          </Popover.Button>
          <Popover.Panel className='absolute w-full z-10'>
            {children}
          </Popover.Panel>
        </>)}
    </Popover>
  )
}

const ContentPanel = ({ className, onApply, btnApplyLabel = 'Apply', children }): JSX.Element => {
  return (
    <div className={className}>
      {children}
      <hr className='my-2.5' />
      <footer className='flex justify-end items-center'>
        <div onClick={onApply}>
          <Popover.Button>
            {btnApplyLabel}
          </Popover.Button>
        </div>
      </footer>
    </div>
  )
}

LeanPopover.ContentPanel = ContentPanel

export default LeanPopover
