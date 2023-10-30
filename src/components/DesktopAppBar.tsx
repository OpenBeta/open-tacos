import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'

import DesktopNavBar, { NavListItem } from './ui/DesktopNavBar'
import XSearch from './search/XSearch'
import DesktopFilterBar from './finder/filters/DesktopFilterBar'
import NavMenuButton from './ui/NavMenuButton'

import { ButtonVariant } from './ui/BaseButton'
import ProfileNavButton from './ProfileNavButton'
import NewPost from './NewPost'
import LogoWithText from '../assets/brand/openbeta-logo-with-text.svg'
import GitHubStars from './GitHubStars'

interface DesktopAppBarProps {
  showFilterBar?: boolean
}

export default function DesktopAppBar ({ showFilterBar = true }: DesktopAppBarProps): JSX.Element {
  const { status } = useSession()

  let navList: JSX.Element | null | JSX.Element[]
  switch (status) {
    case 'authenticated':
      navList = navListAuthenticated
      break
    default:
      navList = navListDefault
  }

  return (
    <header className='sticky top-0 z-10'>
      <DesktopNavBar
        branding={
          <Link href='/'>
            <LogoWithText className='h-[36px]' />
          </Link>
      }
        search={
          <XSearch />
      }
        navList={navList}
      />
      {showFilterBar && <DesktopFilterBar />}
    </header>
  )
}

const navListDefault: JSX.Element[] = [
  {
    action: async () => await signIn('auth0', { callbackUrl: '/api/user/me' }),
    title: 'Login',
    variant: ButtonVariant.SOLID_PRIMARY
  },
  {
    route: 'https://discord.gg/ptpnWWNkJx',
    title: 'Discord',
    variant: ButtonVariant.OUTLINED_SECONDARY
  },
  {
    route: '/about',
    title: 'About'
  },
  {
    route: 'https://opencollective.com/openbeta/contribute/t-shirt-31745',
    title: 'T-shirts'
  },
  {
    route: 'https://docs.openbeta.io',
    title: 'Docs'
  }
].map(
  ({ action, variant, title, route }: NavListItem, index) => (
    <NavMenuButton
      key={index}
      onClick={action}
      variant={variant}
      label={title}
      to={route}
    />)
)

navListDefault.push(
  <GitHubStars key='gh-button' />
)

const navListAuthenticated = (
  <>
    <NewPost isMobile={false} />
    <ProfileNavButton key='dropdown' isMobile={false} />
  </>
)
