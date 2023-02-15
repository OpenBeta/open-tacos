import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession, signOut } from 'next-auth/react'
import { UserCircleIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline'

import { DropdownMenu, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator } from './ui/DropdownMenu'

interface ProfileNavButtonProps {
  isMobile?: boolean
}

/**
 * Render user dropdown menu if the user has logged in.  Return null otherwise.
 */
export default function ProfileNavButton ({ isMobile = true }: ProfileNavButtonProps): JSX.Element | null {
  const router = useRouter()
  const { status } = useSession()
  if (status === 'authenticated') {
    if (isMobile) {
      return (
        <Link href='/api/user/me'>
          <button className='inline-flex btn btn-ghost btn-square'>
            <UserCircleIcon className='stroke-1 stroke-white w-8 h-8' />
          </button>
        </Link>
      )
    }
    return (
      <div className='block relative'>
        <DropdownMenu>
          <DropdownTrigger asChild>
            <button className='btn btn-outline btn-secondary gap-2'>
              <UserCircleIcon className='w-6 h-6 rounded-full' />
              <span className='mt-0.5'>Profile</span>
            </button>
          </DropdownTrigger>

          <DropdownContent>
            <DropdownItem
              icon={<UserCircleIcon className='w-4 h-4' />}
              text='Profile'
              onSelect={async () => await router.push('/api/user/me')}
            />

            <DropdownSeparator />

            <DropdownItem text='About' onSelect={async () => await router.push('/about')} />
            <DropdownItem text='Documentation' onSelect={async () => await router.push('https://docs.openbeta.io')} />

            <DropdownSeparator />

            <DropdownItem
              text='Logout'
              onSelect={async () => {
                sessionStorage.setItem('editMode', 'false')
                await signOut({ callbackUrl: `${window.origin}/api/auth/logout` })
              }}
            />
            <DropdownItem
              icon={<ChatBubbleOvalLeftEllipsisIcon className='w-4 h-4' />}
              text='Discord community'
              onSelect={async () => await router.push('https://discord.gg/ptpnWWNkJx')}
            />
          </DropdownContent>
        </DropdownMenu>
      </div>
    )
  }

  return null
}
