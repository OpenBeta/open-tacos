'use client'
import { usePathname } from 'next/navigation'
import clx from 'classnames'
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr'
import { signOut } from 'next-auth/react'
import { MouseEventHandler } from 'react'

interface NavItem {
  path: string
  label: string
}

const Links: NavItem[] = [
  {
    path: '/account/edit-profile',
    label: 'Profile'
  },
  {
    path: '/account/change-username',
    label: 'Username'
  }
]
export const NavBar: React.FC = () => {
  const pathname = usePathname()
  return (
    <div className='py-8'>
      <div className='mr-4'>
        <ReturnToPublicProfile />
      </div>
      <div className='lg:ml-4 mt-12 flex flex-col gap-2 max-w-xs'>
        <div className='font-semibold text-base-content/70 text-sm'>ACCOUNT SETTINGS</div>
        {Links.map(({ path, label }) => (<MenuItem key={path} path={path} label={label} pagePath={pathname} />))}
        <hr className='border-base-300' />

        <MenuItem
          path='/'
          label='Logout' onClick={(event) => {
            event.stopPropagation()
            event.preventDefault()
            void signOut({ callbackUrl: `${window.origin}/api/auth/logout` })
          }}
        />
      </div>
    </div>
  )
}

const MenuItem: React.FC<NavItem & { pagePath?: string, onClick?: MouseEventHandler }> = ({ path, label, pagePath, onClick }) => {
  return (
    <a
      href={path}
      className={clx('px-4 py-2 rounded-r-lg lg:rounded-r-none rounded-l-lg', pagePath === path ? 'bg-base-100' : 'hover:bg-base-100/40')}
      onClick={(event) => {
        if (onClick != null) {
          onClick(event)
        }
      }}

    >{label}
    </a>
  )
}

export const ReturnToPublicProfile: React.FC = () => {
  return <a className='flex gap-2 items-center btn btn-sm btn-outline no-animation' href='/api/user/me'><ArrowLeftIcon className='w-5 h-5' />Go to your public profile</a>
}
