'use client'
import { signIn, useSession } from 'next-auth/react'
import { MapTrifold, Pulse, LineSegments, Planet } from '@phosphor-icons/react/dist/ssr'

import { Logo } from '../header'
import { XSearchMinimal } from '@/components/search/XSearch'
import { NavMenuItem, NavMenuItemProps } from '@/components/ui/NavMenuButton'
import GitHubStars from '@/components/GitHubStars'
import AuthenticatedProfileNavButton from '../../../components/AuthenticatedProfileNavButton'
import Link from 'next/link'

export const DesktopHeader: React.FC = () => {
  const { status } = useSession()

  const navListDefault: NavMenuItemProps[] = [
    {
      to: 'https://community.openbeta.io',
      label: 'Forums'
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
      to: '/partner-with-us',
      label: 'Become a Partner'
    },
    {
      to: 'https://docs.openbeta.io',
      label: 'Docs'
    },
    {
      onClick: () => { void signIn('auth0', { callbackUrl: '/api/user/me' }) },
      label: 'Login',
      type: 'rounded-btn border bg-accent ring-0 border-b-2 border-b-neutral'
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
      nav = <AuthenticatedProfileNavButton isMobile={false} />
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
    <header className='hidden xl:block'>
      <div className='my-2 flex items-center justify-between'>
        <div className='flex items-center gap-6'>
          <Logo />
          <XSearchMinimal />
          <div className='text-base-300/50 font-thin text-xl'>|</div>
          <Link href='/maps' className='text-sm flex items-center whitespace-nowrap hover:underline hover:decoration-1 font-semibold gap-2'><MapTrifold size={18} />Maps</Link>
        </div>
        <div className='menu menu-horizontal rounded-box gap-2 px-0'>{nav}</div>
      </div>
      <hr className='my-2' />
      <QuickLinks />
    </header>
  )
}

const QuickLinks: React.FC = () => {
  return (
    <div className='mt-4 flex items-center gap-8'>
      {[
        {
          href: '/pulse',
          label: 'Pulse',
          icon: <Pulse size={18} />
        },
        {
          href: '/area/1d33c773-e381-5b8a-a13f-3dfd7991732b/south-africa',
          label: 'S.Africa',
          icon: <LineSegments size={18} />
        },
        {
          href: '/area/2996145f-e1ba-5b56-9da8-30c64ccc3776/canada',
          label: 'Canada',
          icon: <LineSegments size={18} />
        },
        {
          href: '/area/be9733db-21a2-53ec-86a2-3fb6fab552d9/germany',
          label: 'Germany',
          icon: <LineSegments size={18} />
        },
        {
          href: '/area/1db1e8ba-a40e-587c-88a4-64f5ea814b8e/usa',
          label: 'USA',
          icon: <LineSegments size={18} />
        },
        {
          href: '/a',
          label: 'All',
          icon: <Planet size={18} />
        }
      ].map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className='text-xs flex flex-col items-center whitespace-nowrap hover:underline hover:decoration-1 gap-1.5'
        >
          {icon}{label}
        </Link>
      ))}

    </div>
  )
}

// <Link href='/maps' className='text-sm flex flex-col items-center whitespace-nowrap hover:underline hover:decoration-1 font-semibold'><MapTrifold size={18} />Maps</Link>
// <Link href='/pulse' className='text-sm flex flex-col items-center whitespace-nowrap hover:underline hover:decoration-1'><Pulse size={18} /> Pulse</Link>
// <Link href='/area/1db1e8ba-a40e-587c-88a4-64f5ea814b8e/usa' className='text-sm flex flex-col items-center whitespace-nowrap hover:underline hover:decoration-1'><LineSegments size={18} />USA</Link>
// <Link href='/area/2996145f-e1ba-5b56-9da8-30c64ccc3776/canada' className='text-sm flex flex-col items-center whitespace-nowrap hover:underline hover:decoration-1'><LineSegments size={18} />Canada</Link>
// <Link href='/area/1d33c773-e381-5b8a-a13f-3dfd7991732b/south-africa' className='text-sm flex flex-col items-center whitespace-nowrap hover:underline hover:decoration-1'><LineSegments size={18} />S. Africa</Link>
// <Link href='/area/be9733db-21a2-53ec-86a2-3fb6fab552d9/germany' className='text-sm flex flex-col items-center whitespace-nowrap hover:underline hover:decoration-1'><LineSegments size={18} />Germany</Link>
