import Bar from './Bar'
import NavMenuButton from './NavMenuButton'

interface DesktopAppBarProps {
  expanded: boolean
  branding: JSX.Element
  search: JSX.Element
  navList: any[]
}

export default function DesktopAppBar ({ expanded, branding, search, navList }: DesktopAppBarProps): JSX.Element {
  return (
    <header
      className='hidden lg:block w-full'
    >
      <Bar
        className='lg:hidden'
        fixed
        backgroundClass='bg-slate-800'
        heightClass={Bar.H_LG}
        layoutClass={Bar.JUSTIFY_BETWEEN}
        zIndexClass={Bar.Z_HIGH}
      >
        <div>{branding}</div>
        <div className='block'>{search}</div>
        <nav className='flex items-center justify-between'>
          <div className='flex items-center gap-x-4'>
            {navList.map(item => <NavItem key={item.title} {...item} />)}
          </div>
        </nav>
      </Bar>
    </header>
  )
}

interface NavItemProps {
  route: string
  title: string
  cta: boolean
}
const NavItem = ({ route, title, cta }: NavItemProps): JSX.Element => {
  return (
    <NavMenuButton
      cta={cta}
      label={title}
      to={route}
    />
  )
}
