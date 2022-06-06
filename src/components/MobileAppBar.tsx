import Link from 'next/link'
import CragFinder from './search/CragFinder'
import MobileNavBar from './ui/MobileNavBar'
import { HomeIcon, MenuIcon } from '@heroicons/react/outline'
import MobileFilterBar from './finder/filters/MobileFilterBar'
import { Popover } from '@headlessui/react'
import { Button, ButtonVariant } from './ui/BaseButton'
import { signIn, signOut, useSession } from 'next-auth/react'
import ProfileNavButton from './ProfileNavButton'
import NewPost from './NewPost'

interface HeaderProps {
  includeFilters: boolean
}

export default function MobileAppBar (props: HeaderProps): JSX.Element {
  const { status } = useSession()
  const nav = status === 'authenticated' ? <AuthenticatedNav /> : <LoginButton />
  return (
    <>
      <MobileNavBar
        branding={<Branding />}
        home={<Home />}
        search={<CragFinder />}
        profile={nav}
        more={<More />}
      />
      {props.includeFilters && <MobileFilterBar />}
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
    label={<HomeIcon className='w-6 h-6 text-secondary' />}
    href='/'
  />)

const Branding = (): JSX.Element => {
  return (
    <Link href='/'>
      <a className='font-semibold text-lg text-secondary pt-1'>OpenTacos</a>
    </Link>
  )
}

const More = (): JSX.Element => {
  const { status } = useSession()
  return (
    <Popover>
      <Popover.Button as='div' className='flex center-items'>
        <Button label={<MenuIcon className='text-secondary w-8 h-8' />} />
      </Popover.Button>

      <Popover.Panel className='absolute z-20 right-0 mt-2 p-6 bg-white rounded-md'>
        <div className='grid'>
          {status === 'authenticated' ? <Button onClick={async () => await signOut({ callbackUrl: `${window.origin}/api/auth/logout` })} label='Logout' /> : <Button onClick={async () => await signIn()} label='Login' />}
          <Button href='/about' label='About' />
          <Button
            href='https://discord.gg/2A2F6kUtyh'
            label='Discord'
            variant={ButtonVariant.SOLID_SECONDARY}
          />
        </div>
      </Popover.Panel>
    </Popover>
  )
}
