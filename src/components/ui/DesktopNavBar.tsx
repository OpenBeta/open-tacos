import { More } from '../MobileAppBar'
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
      <div className='flex w-full items-center'>
        <div className='shrink hidden lg:block mr-2'>{branding}</div>

        <div className='flex-1 lg:px-8 pr-4'>
          {search}
        </div>

        <nav className='lg:flex items-center hidden'>
          <div className='flex items-center lg:gap-x-4'>
            {navList}
          </div>
        </nav>

        <div className='w-12 lg:hidden'>
          <More />
        </div>
      </div>
    </Bar>
  )
}
