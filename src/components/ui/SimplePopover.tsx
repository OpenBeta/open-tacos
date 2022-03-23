import { Popover } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

const SimplePopover = ({ label, children }): JSX.Element => {
  return (
    <Popover className=''>
      {({ open }) => (
        <>
          <Popover.Button className='border-2 rounded-2xl btn-small border-neutral-100 text-neutral-100 flex flex-row space-x-1.5 center-items'>
            <span>{label}</span>
            <div className='w-4 h-4'><ChevronDownIcon className={`text-white ${open ? 'transform rotate-180' : ''}`} /></div>
          </Popover.Button>
          <Popover.Panel className='absolute w-full z-10'>
            {children}
          </Popover.Panel>
        </>)}
    </Popover>
  )
}

export default SimplePopover
