'use client'
import Link from 'next/link'
import React from 'react'
import { signIn, useSession } from 'next-auth/react'
import { MapTrifold, Pulse, LineSegments, Planet } from '@phosphor-icons/react/dist/ssr'

import { Logo, MobileLink } from '../header'
import { XSearchMinimal } from '@/components/search/XSearch'
import { NavMenuItem, NavMenuItemProps } from '@/components/ui/NavMenuButton'
import GitHubStars from '@/components/GitHubStars'
import AuthenticatedProfileNavButton from '../../../components/AuthenticatedProfileNavButton'
import googlePlay from '@/public/GetItOnGooglePlay_Badge_Web_color.png'

export const DesktopHeader: React.FC = () => {
  const navListDefault: NavMenuItemProps[] = [
    {
      to: 'https://community.openbeta.io',
      label: 'Forums'
    },
    {
      to: process.env.NEXT_PUBLIC_DISCORD_INVITE ?? '',
      label: 'Discord'
    },
    {
      to: 'https://opencollective.com/openbeta/contribute/t-shirt-31745',
      label: 'T-shirts'
    },
    {
      to: '/about',
      label: 'About us'
    },

    {
      to: '/partner-with-us',
      label: 'Become a Partner'
    },
    {
      to: 'https://docs.openbeta.io',
      label: 'Docs'
    }
  ]

  const topLevelNav = navListDefault.map(
    ({ onClick, label, to, type }: NavMenuItemProps, index) => (
      <NavMenuItem
        key={index}
        onClick={onClick}
        type={type}
        label={label}
        to={to}
      />)
  )

  topLevelNav.push(<GitHubStars key='github-stars' />)

  return (
    <header className='hidden lg:block'>
      <div className='my-2 flex flex-col items-center'>
        <div className='self-end flex items-center gap-6 py-2'>{topLevelNav}</div>
        <div className='flex items-center justify-between gap-6 w-full py-4'>
          <div className='flex items-center gap-6'>
            <Logo />
            <XSearchMinimal />
            <div className='text-base-300/50 font-thin text-xl'>|</div>
            <Link href='/maps' className='text-sm flex items-center whitespace-nowrap hover:underline hover:decoration-1 font-semibold gap-2'><MapTrifold size={18} />Maps</Link>
            <MobileLink
              link='https://play.google.com/store/apps/details?id=io.openbeta'
              description='Get it on Google Play'
              image={googlePlay}
            />
          </div>
          <div>
            <SignupOrLogin />
          </div>
        </div>
        <div className='mt-2 w-full flex flex-col items-center'>
          <hr className='w-full' />
          <QuickLinks />
          <hr className='w-full border-base-content' />
        </div>
      </div>
    </header>
  )
}

const QuickLinks: React.FC = () => {
  return (
    <div className='flex items-center gap-8 py-3'>
      {[
        {
          href: '/pulse',
          label: 'Pulse',
          icon: <Pulse size={16} />
        },
        {
          href: '/area/1d33c773-e381-5b8a-a13f-3dfd7991732b/south-africa',
          label: 'S.Africa',
          icon: <LineSegments size={16} />
        },
        {
          href: '/area/2996145f-e1ba-5b56-9da8-30c64ccc3776/canada',
          label: 'Canada',
          icon: <LineSegments size={16} />
        },
        {
          href: '/area/be9733db-21a2-53ec-86a2-3fb6fab552d9/germany',
          label: 'Germany',
          icon: <LineSegments size={16} />
        },
        {
          href: '/area/1db1e8ba-a40e-587c-88a4-64f5ea814b8e/usa',
          label: 'USA',
          icon: <LineSegments size={16} />
        },
        {
          href: '/a',
          label: 'All',
          icon: <Planet size={16} />
        }
      ].map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          prefetch={false}
          className='text-xs font-semibold text-primary/80 flex items-center whitespace-nowrap hover:underline hover:decoration-1 gap-1.5'
        >
          {icon}{label}
        </Link>
      ))}

    </div>
  )
}

const SignupOrLogin: React.FC = () => {
  const { status } = useSession()
  if (status === 'loading') {
    return (<button className='btn btn-disabled' disabled>Please wait...</button>)
  }
  if (status === 'authenticated') {
    return <AuthenticatedProfileNavButton isMobile={false} />
  }

  return (
    <div className='flex items-center gap-4'>
      <SignupButton />
      <LoginButton />
    </div>
  )
}

export const LoginButton: React.FC = () => {
  return (
    <>
      <button className='btn btn-primary btn-outline' onClick={() => { void signIn() }}>
        Login
      </button>
    </>
  )
}

export const SignupButton: React.FC = () => {
  return (
    <>
      <button className='btn btn-accent border-b-2 border-b-neutral' onClick={() => { void signIn('auth0', undefined, { screen_hint: 'signup' }) }}>
        Sign up
      </button>
    </>
  )
}
