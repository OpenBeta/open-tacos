import Link from 'next/link'
import CragFinder from './search/CragFinder'
import MobileNavBar from './ui/MobileNavBar'
import { HomeIcon, MenuIcon } from '@heroicons/react/outline'
import MobileFilterBar from './finder/filters/MobileFilterBar'
import { Popover } from '@headlessui/react'
import { Button } from './ui/BaseButton'
import { useUser } from '@auth0/nextjs-auth0'

export default function MobileAppBar (): JSX.Element {
  return (
    <>
      <MobileNavBar
        branding={<Branding />}
        home={<Home />}
        search={<CragFinder />}
        more={<More />}
      />
      <MobileFilterBar />
    </>
  )
}

const Home = (): JSX.Element => {
  return (
    <Link href='/'>
      <a>
        <HomeIcon className='text-primary' />
      </a>
    </Link>
  )
}

const Branding = (): JSX.Element => {
  return (
    <Link href='/'>
      <a className='font-semibold text-lg text-primary pt-1'>OpenTacos</a>
    </Link>
  )
}

const More = (): JSX.Element => {
  const { user } = useUser()
  return (
    <Popover>
      <Popover.Button className='flex center-items'>
        <MenuIcon className='w-8 h-8' />
      </Popover.Button>

      <Popover.Panel className='absolute z-20 right-0 mt-2 p-6 bg-white rounded-md'>
        <div className='grid'>
          {user == null ? <Button href='/api/auth/login' label='Login' /> : <Button href='/api/auth/logout' label='Logout' />}
          <Button href='/about' label='About' />
          <Button
            href='https://discord.gg/2A2F6kUtyh'
            label='Discord'
            variant={Button.VARIANT_SOLID_SECONDARY}
          />
        </div>
      </Popover.Panel>
    </Popover>
  )
}
