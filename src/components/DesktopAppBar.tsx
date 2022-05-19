import Image from 'next/image'

import DesktopNavBar, { NavListItem } from './ui/DesktopNavBar'
import ClimbSearch from './search/ClimbSearch'
import XSearch from './search/XSearch'
import DesktopFilterBar from './finder/filters/DesktopFilterBar'
import { useCanary } from '../js/hooks'
import { ButtonVariant } from './ui/BaseButton'
import { useSession, signIn, signOut } from 'next-auth/react'

interface DesktopAppBarProps {
  expanded: boolean
  onExpandSearchBox: Function
  onClose: Function
}

export default function DesktopAppBar ({ expanded, onExpandSearchBox, onClose }: DesktopAppBarProps): JSX.Element {
  const canary = useCanary()
  const { status } = useSession()

  const navList: NavListItem[] = [
    {
      route: '/about',
      title: 'About'
    },
    {
      route: 'https://docs.openbeta.io',
      title: 'Docs'
    },
    {
      route: 'https://discord.gg/2A2F6kUtyh',
      title: 'Discord',
      variant: ButtonVariant.OUTLINED_PRIMARY
    }
  ]

  if (status === 'authenticated') {
    navList.unshift({
      action: async () => await signOut({ callbackUrl: `${window.origin}/api/auth/logout` }),
      title: 'Logout'
    })
  } else {
    navList.unshift({
      action: async () => await signIn('auth0'),
      title: 'Login',
      variant: ButtonVariant.SOLID_SECONDARY
    })
  }

  return (
    <header className='sticky top-0 z-10'>
      <DesktopNavBar
        expanded={expanded}
        branding={
          <a href='/' className='inline-flex flex-rows justify-start items-center md:gap-x-2'>
            <Image className='align-middle' src='/tortilla.png' height={32} width={32} />
            <span className='hidden md:inline-flex items-center font-semibold text-xl lg:text-2xl text-custom-primary pt-1'>OpenTacos</span>
          </a>
      }
        search={
          canary
            ? <XSearch isMobile={false} />
            : <ClimbSearch
                expanded={expanded}
                onClick={onExpandSearchBox}
                onClickOutside={onClose}
              />
      }
        navList={navList}
      />
      <DesktopFilterBar />
    </header>
  )
}
