import clx from 'classnames'

import OpenBetaLogo from '@/assets/brand/openbeta-logo'
import { DesktopHeader } from './components/DesktopHeader'
import { MobileHeader } from './components/MobileHeader'

/**
 * Root page header
 */
export default async function Header (): Promise<any> {
  return (
    <div className='default-page-margins'>
      <DesktopHeader />
      <MobileHeader />
    </div>
  )
}

export enum LogoSize {
  sm = 'w-8 h-8',
  md = 'w-12 h-12',
  lg = 'w-16 h-16'
}
/**
 * Reusable logo component
 */
export const Logo: React.FC<{ size?: LogoSize, className?: string, withText?: boolean }> = ({ size = LogoSize.sm, className, withText = false }) => {
  return (
    <a href='/' className='flex items-center gap-2'>
      <OpenBetaLogo className={clx(size, className)} />
      {withText && <span className='font-bold text-lg tracking-tight'>OpenBeta</span>}
    </a>
  )
}
