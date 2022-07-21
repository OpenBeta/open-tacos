import Link from 'next/link'
import { Popover } from '@headlessui/react'
import Image from 'next/image'

import MobileNavBar from './ui/MobileNavBar'
import { HomeIcon, MenuIcon } from '@heroicons/react/outline'
import OpenBetaLogo from '../assets/brand/openbeta-logo.svg'

import MobileFilterBar from './finder/filters/MobileFilterBar'
import { Button, ButtonVariant } from './ui/BaseButton'
import { signIn, signOut, useSession } from 'next-auth/react'
import ProfileNavButton from './ProfileNavButton'
import NewPost from './NewPost'
import XSearch from './search/XSearch'

interface HeaderProps {
  includeFilters: boolean
  isTablet: boolean
}

export default function MobileAppBar ({ isTablet, includeFilters }: HeaderProps): JSX.Element {
  const { status } = useSession()
  const nav = status === 'authenticated' ? <AuthenticatedNav /> : <LoginButton />
  return (
    <>
      <MobileNavBar
        branding={<Branding />}
        home={<Home />}
        search={<XSearch isMobile={!isTablet} placeholder='Search' />}
        profile={nav}
        more={<More />}
      />
      {includeFilters && <MobileFilterBar />}
    </>
  )
}

const AuthenticatedNav = (): JSX.Element => (
  <>
    <NewPost />
    <ProfileNavButton />
  </>

)

const LoginButton = (): JSX.Element => (
  <Button
    label='Login'
    onClick={async () => await signIn('auth0', { callbackUrl: '/api/user/me' })}
    variant={ButtonVariant.SOLID_PRIMARY}
  />)

const Home = (): JSX.Element => (
  <Button
    label={<HomeIcon className='w-6 h-6 text-white' />}
    href='/'
  />)

const Branding = (): JSX.Element => {
  return (
    <Link href='/'>
      <a>
        <Image width={16} height={16} src={OpenBetaLogo} layout='responsive' />
      </a>
    </Link>
  )
}

const More = (): JSX.Element => {
  const { status } = useSession()
  return (
    <Popover>
      <Popover.Button as='div' className='z-50 flex center-items'>
        <Button label={<MenuIcon className='text-white w-8 h-8' />} />
      </Popover.Button>

      <Popover.Panel className='absolute z-20 right-0 mt-2 p-6 bg-white rounded-md'>
        <div className='grid'>
          {status === 'authenticated' ? <Button size='lg' onClick={async () => await signOut({ callbackUrl: `${window.origin}/api/auth/logout` })} label='Logout' /> : <Button size='lg' onClick={async () => await signIn()} label='Login' />}
          <Button size='lg' href='/about' label='About' />
          <Button
            size='lg'
            href='https://discord.gg/2A2F6kUtyh'
            label='Discord'
            variant={ButtonVariant.SOLID_SECONDARY}
          />
        </div>
      </Popover.Panel>
    </Popover>
  )
}
