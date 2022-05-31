import { useSession } from 'next-auth/react'
import { Button } from './ui/BaseButton'
import { UserCircleIcon } from '@heroicons/react/outline'

interface ProfileNavButtonProps {
  isMobile?: boolean
}

/**
 * Render user profile icon button if the user has logged in.  Return null otherwise.
 */
export default function ProfileNavButton ({ isMobile = true }: ProfileNavButtonProps): JSX.Element | null {
  const { status } = useSession()
  if (status === 'authenticated') {
    if (isMobile) {
      return (
        <Button
          label={<UserCircleIcon className='mt-1 w-8 h-8 bg-ob-secondary p-0.5 rounded-full' />}
          href='/api/user/me'
        />
      )
    }
    return (
      <Button
        label={
          <span className='flex items-center space-x-2 border border-gray-500 hover:ring-2 rounded-full px-1 py-1'><UserCircleIcon className='w-6 h-6 bg-ob-secondary p-1 rounded-full' />
            <span className='mt-0.5 text-white pr-1'>Profile</span>
          </span>
        }
        href='/api/user/me'
      />

    )
  }

  return null
}
