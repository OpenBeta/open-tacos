import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { signIn } from 'next-auth/react'

import { LeanAlert, AlertAction } from '../ui/micro/AlertDialogue'

import CatchingBugs from '../../assets/media/bug-beta-testing.png'

const STORAGE_KEY = 'edit.beta.cta'

/**
 * A delayed Call-to-action
 */
export default function MainCta (): JSX.Element | null {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const flag = localStorage.getItem(STORAGE_KEY)
    if (flag === '1') {
      return
    }
    const timer = setTimeout(() => {
      setOpen(true)
    }, 5000)
    return () => clearTimeout(timer)
  })
  return open
    ? (
      <LeanAlert
        closeOnEsc
        title={<Image src={CatchingBugs} objectFit='fill' />}
        description={<span>Help us test the new <span className='underline decoration-wavy decoration-secondary underline-offset-2'>edit feature</span>.  Sign in and edit an area description!</span>}
        className='bg-primary text-base-100'
      >
        <div>
          <AlertAction
            className='w-full btn btn-small btn-solid btn-accent gap-2'
            onClick={() => { void signIn('auth0') }}
          >
            Sign in <ArrowRightIcon className='h-4 w-4' />
          </AlertAction>
          <AlertAction
            className='w-full btn btn-link text-base-300 text-xs lg:text-sm'
            onClick={() => { localStorage.setItem(STORAGE_KEY, '1') }}
          >
            Don't show this again
          </AlertAction>
        </div>
      </LeanAlert>)
    : null
}
