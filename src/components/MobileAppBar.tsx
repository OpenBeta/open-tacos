import Link from 'next/link'
import { Popover } from '@headlessui/react'

import MobileNavBar from './ui/MobileNavBar'
import { HomeIcon, Bars3Icon } from '@heroicons/react/24/outline'
import OpenBetaLogo from '../assets/brand/openbeta-logo.svg'

import MobileFilterBar from './finder/filters/MobileFilterBar'
import { Button, ButtonVariant } from './ui/BaseButton'
import { signIn, signOut, useSession } from 'next-auth/react'
import ProfileNavButton from './ProfileNavButton'
import NewPost from './NewPost'
import { XSearchMobile } from './search/XSearch'
import { MouseEventHandler } from 'react'

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
        search={<XSearchMobile />}
        profile={nav}
        more={<More />}
      />
      {includeFilters && <MobileFilterBar />}
    </>
  )
}

const AuthenticatedNav = (): JSX.Element => (
  <>
    <NewPost className='inline-flex' />
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
  <Link href='/'>
    <button className='btn btn-square btn-ghost'>
      <HomeIcon className='w-6 h-6 text-white' />
    </button>
  </Link>)

const Branding = (): JSX.Element => {
  return (
    <Link href='/'>
      <a className='inline-block px-4'>
        <OpenBetaLogo className='inline-block w-6 h-6 ' />
      </a>
    </Link>
  )
}

const More = (): JSX.Element => {
  const { status } = useSession()
  return (
    <Popover>
      <Popover.Button as='div' className='z-50 flex center-items'>
        <Button label={<Bars3Icon className='text-white w-8 h-8' />} />
      </Popover.Button>

      <Popover.Panel className='absolute z-20 right-0 mt-2 p-6 bg-white rounded-md w-full max-w-md'>
        <div className='grid'>
          {status === 'authenticated'
            ? (
              <>
                <a className='btn btn-ghost no-animation btn-block' href='/api/user/me?preview=1'><span className='pl-10'>Dashboard</span> <sup className='ml-2 badge badge-sm badge-primary'>Beta</sup></a>
                <a className='btn btn-ghost no-animation btn-block' href='/account/editProfile'>Account settings</a>
                <a className='btn btn-ghost no-animation btn-block' href='/' onClick={logoutHandler}>Logout</a>
              </>)
            : <a className='btn btn-accent no-animation btn-block' href='/' onClick={signInHandler}>Login</a>}
          <hr />
          <a className='btn btn-ghost no-animation btn-block text-accent' href='https://opencollective.com/openbeta/contribute/t-shirt-31745'>Get your OpenBeta T-shirts</a>
          <hr />
          <a className='btn btn-ghost no-animation btn-block' href='/about'>About</a>
          <a className='btn btn-ghost no-animation btn-block' href='https://docs.openbeta.io'>Documentation</a>
          <a className='btn btn-ghost no-animation btn-block' href='https://openbeta.io/blog'>Blog</a>
          <hr />
          <a className='btn btn-ghost no-animation btn-block' href='https://github.com/OpenBeta/open-tacos'>GitHub</a>
          <a className='btn btn-outline no-animation btn-block' href='https://discord.gg/ptpnWWNkJx'>Discord community</a>
        </div>
      </Popover.Panel>
    </Popover>
  )
}

const logoutHandler: MouseEventHandler = async (event) => {
  event.stopPropagation()
  event.preventDefault()
  sessionStorage.setItem('editMode', 'false')
  await signOut({ callbackUrl: `${window.origin}/api/auth/logout` })
}

const signInHandler: MouseEventHandler = async (event) => {
  event.stopPropagation()
  event.preventDefault()
  await signIn('auth0')
}
