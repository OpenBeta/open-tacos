import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { UserCircleIcon, ChatBubbleOvalLeftEllipsisIcon, Cog6ToothIcon, ChartBarIcon, GiftIcon } from '@heroicons/react/24/outline'

import { DropdownMenu, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator } from '@/components/ui/DropdownMenu'
import GitHubIcon from '@/assets/icons/github.inline.svg'

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
        <Link href='/api/user/me' legacyBehavior>
          <button className='inline-flex btn btn-ghost btn-square'>
            <UserCircleIcon className='stroke-1 w-8 h-8' />
          </button>
        </Link>
      )
    }
    return (
      <div className='block relative'>
        <DropdownMenu>
          <DropdownTrigger asChild>
            <button className='btn btn-primary btn-sm gap-2'>
              <UserCircleIcon className='w-6 h-6 rounded-full' />
              Profile
            </button>
          </DropdownTrigger>

          <DropdownContent>
            <DropdownItem
              icon={<ChartBarIcon className='w-4 h-4' />}
              text={<><span className='font-medium'>Dashboard </span><sup className='badge badge-sm badge-primary'>Beta</sup></>}
              onSelect={() => { void router.push('/api/user/me?preview=1') }}
            />

            <DropdownItem
              icon={<UserCircleIcon className='w-4 h-4' />}
              text='Profile'
              onSelect={() => { void router.push('/api/user/me') }}
            />

            <DropdownSeparator />

            <DropdownItem
              icon={<Cog6ToothIcon className='w-4 h-4' />}
              text='Account settings'
              onSelect={() => { void router.push('/account/editProfile') }}
            />

            <DropdownItem
              text='Logout'
              onSelect={() => {
                sessionStorage.setItem('editMode', 'false')
                void signOut({ callbackUrl: `${window.origin}/api/auth/logout` })
              }}
            />
            <DropdownSeparator />

            <DropdownItem text='About' onSelect={() => { void router.push('/about') }} />
            <DropdownItem text='Documentation' onSelect={() => { void router.push('https://docs.openbeta.io') }} />
            <DropdownItem text='Blog' onSelect={() => { void router.push('https://openbeta.io/blog') }} />

            <DropdownSeparator />

            <DropdownItem
              icon={<GiftIcon className='w-4 h-4' />}
              text='Get your OpenBeta T-shirts'
              className='text-accent'
              onSelect={() => { void router.push('https://opencollective.com/openbeta/contribute/t-shirt-31745') }}
            />
            <DropdownSeparator />

            <DropdownItem
              icon={<GitHubIcon className='w-4 h-4' />}
              text='GitHub'
              onSelect={() => { void router.push('https://github.com/OpenBeta/open-tacos') }}
            />
            <DropdownItem
              icon={<ChatBubbleOvalLeftEllipsisIcon className='w-4 h-4' />}
              text='Discord community'
              onSelect={() => { void router.push('https://discord.gg/ptpnWWNkJx') }}
            />
          </DropdownContent>
        </DropdownMenu>
      </div>
    )
  }

  return null
}
