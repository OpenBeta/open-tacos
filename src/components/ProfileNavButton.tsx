import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { UserCircleIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline'

import { Menu } from '@headlessui/react'
import { Button, ButtonVariant } from './ui/BaseButton'
import Dropdown from './ui/Dropdown'
interface ProfileNavButtonProps {
  isMobile?: boolean
}

/**
 * Render user dropdown menu if the user has logged in.  Return null otherwise.
 */
export default function ProfileNavButton ({ isMobile = true }: ProfileNavButtonProps): JSX.Element | null {
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
        <Dropdown
          button={
            <Button
              label={
                <>
                  <UserCircleIcon className='stroke-white w-6 h-6 rounded-full' />
                  <span className='mt-0.5'>Profile</span>
                </>
              }
              variant={ButtonVariant.ROUNDED_ICON_CONTRAST}
            />
          }
          activeClz='rounded-full ring-1 ring-gray-500'
        >
          <>
            <Menu.Item>
              <a
                className='flex items-center space-x-2 font-semibold'
                href='/api/user/me'
              >
                <UserCircleIcon className='w-4 h-4' /> <span className='mt-0.5'>Profile</span>
              </a>
            </Menu.Item>

            <hr className='py-0 my-1' />

            <Menu.Item>
              {({ active }: {active: boolean}) => (
                <a
                  className='block text-secondary'
                  href='/about'
                >
                  About
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              <a
                className='block text-secondary'
                href='https://docs.openbeta.io'
              >
                Documentation
              </a>
            </Menu.Item>

            <Menu.Item>
              <button
                className='block w-full text-left text-secondary'
                onClick={async () => await signOut({ callbackUrl: `${window.origin}/api/auth/logout` })}
              >
                Logout
              </button>
            </Menu.Item>

            <hr className='py-0 my-1' />

            <Menu.Item>
              <a
                className='flex items-center space-x-2 text-secondary' href='https://discord.gg/2A2F6kUtyh'
              >
                <ChatBubbleOvalLeftEllipsisIcon className='w-4 h-4 stroke-gray-500' />
                <span className='mt-0.5'>Discord community</span>
              </a>
            </Menu.Item>
          </>
        </Dropdown>
      </div>
    )
  }

  return null
}
