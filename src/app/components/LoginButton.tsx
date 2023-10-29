'use client'
import { signIn } from 'next-auth/react'

import { ArrowRightIcon } from '@heroicons/react/24/outline'

/**
 * Client-side button
 */
export const LoginButtonClient: React.FC<{ className: string, label: string }> = ({ className, label }) => {
  return (
    <button
      className={className} onClick={() => {
        void signIn('auth0')
      }}
    >{label} <ArrowRightIcon className='w-4 h-4' />
    </button>
  )
}
