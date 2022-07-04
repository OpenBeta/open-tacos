import Bar from './Bar'
import { ButtonVariant } from './BaseButton'
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
  navList: JSX.Element[] | JSX.Element | null
}

export default function DesktopNavBar ({ expanded, branding, search, navList }: DesktopAppBarProps): JSX.Element {
  return (
    <Bar
      backgroundClass={Bar.BG_DARK}
      heightClass={Bar.H_LG}
      layoutClass={Bar.JUSTIFY_BETWEEN}
    >
      <div className='shrink'>{branding}</div>
      <div className='block'>{search}</div>
      <nav className='flex items-center justify-between'>
        <div className='flex items-center gap-x-4'>
          {navList}
        </div>
      </nav>
    </Bar>
  )
}
