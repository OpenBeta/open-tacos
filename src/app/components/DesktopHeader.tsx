'use client'
import { signIn } from 'next-auth/react'

import { Logo } from 'app/header'
import { XSearchMinimal } from '@/components/search/XSearch'
import { NavMenuItem, NavMenuItemProps } from '@/components/ui/NavMenuButton'
import GitHubStars from '@/components/GitHubStars'

export const DesktopHeader: React.FC = () => {
  const navListDefault: NavMenuItemProps[] = [
    {
      to: 'https://discord.gg/ptpnWWNkJx',
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

  const menu = navListDefault.map(
    ({ onClick, label, to, type }: NavMenuItemProps, index) => (
      <NavMenuItem
        key={index}
        onClick={onClick}
        type={type}
        label={label}
        to={to}
      />)
  )

  menu.unshift(
    <GitHubStars key='gh-button' />
  )

  return (
    <header className='hidden lg:flex items-center justify-between'>
      <div className='flex items-center gap-6'><Logo />
        <XSearchMinimal />
      </div>
      <div className='menu menu-vertical lg:menu-horizontal rounded-box gap-2'>{menu}</div>
    </header>
  )
}
