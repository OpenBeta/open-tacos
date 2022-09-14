import { XIcon } from '@heroicons/react/outline'
import { ReactNode } from 'react'

export interface MobileCardProps {
  title?: string
  children: ReactNode
  onClose: () => void
}

/**
 * A full screen card with a title and cancel (back) action
 */
export default function MobileScreen ({ title, children, onClose }: MobileCardProps): any {
  return (
    <div className='card card-compact bg-base-200'>
      <div className='card-body'>
        <div className='card-actions justify-between items-center align-middle'>
          <button className='btn btn-circle btn-ghost btn-sm' onClick={onClose}>
            <XIcon className='w-6 h-6' />
          </button>
          <h2 className='card-title'>{title}</h2>
          <div className='w-8 h-8' />
        </div>
        {children}
      </div>
    </div>
  )
}
