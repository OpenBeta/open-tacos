import { Popover } from '@headlessui/react'

import SimplePopover from './SimplePopover'

const GradeFilterPopover = ({ label, heading, slider, min, max, onApply }): JSX.Element => {
  return (
    <div className='max-w-sm w-full'>
      <SimplePopover label={label}>
        <div className='mt-2 bg-white rounded-md p-4 drop-shadow-md'>
          <header className='mb-16'>{heading}</header>
          <div className='px-4'>{slider}</div>
          <div className='mt-8 flex justify-between text-sm'>
            <div>{min}</div>
            <div>{max}</div>
          </div>
          <hr className='my-2.5' />
          <footer className='flex justify-end items-center'>
            <div onClick={onApply}>
              <Popover.Button>
                Apply
              </Popover.Button>
            </div>
          </footer>
        </div>
      </SimplePopover>
    </div>
  )
}

export default GradeFilterPopover
