import { useSession } from 'next-auth/react'
import { PlusIcon } from '@heroicons/react/solid'

import { Button, ButtonVariant } from './ui/BaseButton'

interface ProfileNavButtonProps {
  isMobile?: boolean
}

export default function NewPost ({ isMobile = true }: ProfileNavButtonProps): JSX.Element | null {
  const { status } = useSession()
  if (status === 'authenticated') {
    if (isMobile) {
      return (
        <Button
          label={<PlusIcon className='mt-1 w-8 h-8 bg-ob-secondary p-0.5 rounded-full' />}
          href='/api/user/me'
        />
      )
    }
    return (

      <Button
        label={
          <>
            <PlusIcon className='stroke-white stroke-2 w-4 h-4' />
            <span className='mt-0.5'>Photo</span>
          </>
}
        variant={ButtonVariant.SOLID_PRIMARY}
        href='/api/user/me'
      />

    )
  }

  return null
}
