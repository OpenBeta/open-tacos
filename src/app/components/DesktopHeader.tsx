'use client'
import { signIn, useSession } from 'next-auth/react'

import { Logo } from 'app/header'
import { XSearchMinimal } from '@/components/search/XSearch'
import { NavMenuItem, NavMenuItemProps } from '@/components/ui/NavMenuButton'
import GitHubStars from '@/components/GitHubStars'
import ProfileNavButton from './ProfileNavButton'

export const DesktopHeader: React.FC = () => {
  const { status } = useSession()

  const navListDefault: NavMenuItemProps[] = [
    {
      to: process.env.NEXT_PUBLIC_DISCORD_INVITE,
      label: 'Discord'
    },
    {
      to: '/about',
      label: 'About'
    },
    {
      to: 'https://opencollective.com/openbeta/contribute/t-shirt-31745',
      label: 'T-shirts'
    },
    {
      to: 'https://docs.openbeta.io',
      label: 'Docs'
    },
    {
      onClick: () => { void signIn('auth0', { callbackUrl: '/api/user/me' }) },
      label: 'Login',
      type: 'rounded-btn border bg-accent'
    }
  ]

  const unauthenticatedMenu = navListDefault.map(
    ({ onClick, label, to, type }: NavMenuItemProps, index) => (
      <NavMenuItem
        key={index}
        onClick={onClick}
        type={type}
        label={label}
        to={to}
      />)
  )

  unauthenticatedMenu.unshift(
    <GitHubStars key='gh-button' />
  )

  let nav
  switch (status) {
    case 'authenticated':
      nav = <ProfileNavButton isMobile={false} />
      break
    case 'loading':
      nav = (
        <>
          <div className='rounded-full bg-base-200 opacity-10 w-32 h-10' />
        </>
      )
      break
    default:
      nav = unauthenticatedMenu
  }

  return (
    <header className='hidden lg:flex items-center justify-between h-14'>
      <div className='flex items-center gap-6'><Logo />
        <XSearchMinimal />
      </div>
      <div className='menu menu-horizontal rounded-box gap-2'>{nav}</div>
    </header>
  )
}
