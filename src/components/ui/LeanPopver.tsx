import { Popover } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

/**
 * Barebone popover component for grades, radius, disciplines selector
 */
const LeanPopover: React.FC<any> = ({ btnClz, btnLabel, children }) => {
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

export const ContentPanel: React.FC<any> = ({ className, onApply, btnApplyLabel = 'Apply', children }) => {
  return (
    <div className={className}>
      {children}
      <hr className='mt-8' />
      <footer className='mt-2 flex justify-between items-center'>
        <Popover.Button className='text-secondary hover:underline'>
          Cancel
        </Popover.Button>
        <Popover.Button
          className='text-primary-contrast bg-slate-800 rounded-md px-2 py-0.5'
          onClick={onApply}
        >
          {btnApplyLabel}
        </Popover.Button>
      </footer>
    </div>
  )
}

export default LeanPopover
