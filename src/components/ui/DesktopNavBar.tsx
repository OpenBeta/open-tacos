import Bar from './Bar'
import { ButtonVariant } from './BaseButton'
import NavMenuButton from './NavMenuButton'
import ProfileNavIcon from '../ProfileNavIcon'
export interface NavListItem {
  title: string
  route?: string
  variant?: ButtonVariant
  action?: () => void
}
interface DesktopAppBarProps {
  expanded: boolean
  branding: JSX.Element
  search: JSX.Element
  navList: NavListItem[]
}

export default function DesktopNavBar ({ expanded, branding, search, navList }: DesktopAppBarProps): JSX.Element {
  return (
    <Bar
      backgroundClass='bg-slate-800'
      heightClass={Bar.H_LG}
      layoutClass={Bar.JUSTIFY_BETWEEN}
    >
      <div>{branding}</div>
      <div className='block'>{search}</div>
      <nav className='flex items-center justify-between'>
        <ProfileNavIcon />
        <div className='flex items-center gap-x-4'>
          {navList.map(item => <NavItem key={item.title} {...item} />)}
        </div>
      </nav>
    </Bar>
  )
}

const NavItem = ({ route, title, variant, action }: NavListItem): JSX.Element => {
  return (
    <NavMenuButton
      onClick={action}
      variant={variant}
      label={title}
      to={route}
    />
  )
}
