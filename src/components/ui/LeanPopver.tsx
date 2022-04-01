import { Popover } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

/**
 * Barebone popover component for grades, radius, disciplines selector
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
          <Popover.Panel className='absolute z-10'>
            {children}
          </Popover.Panel>
        </>)}
    </Popover>
  )
}

const ContentPanel = ({ className, onApply, onCancel, btnApplyLabel = 'Apply', children }): JSX.Element => {
  return (
    <div className={className}>
      {children}
      <hr className='mt-8' />
      <footer className='mt-2 flex justify-between items-center'>
        <div onClick={onCancel}>
          <Popover.Button className='text-secondary hover:underline'>
            Cancel
          </Popover.Button>
        </div>
        <div onClick={onApply}>
          <Popover.Button className='text-primary-contrast bg-slate-800 rounded-md px-2 py-0.5'>
            {btnApplyLabel}
          </Popover.Button>
        </div>
      </footer>
    </div>
  )
}

LeanPopover.ContentPanel = ContentPanel

export default LeanPopover
