import Link from 'next/link'
import clx from 'classnames'

import OpenBetaLogo from '@/assets/brand/openbeta-logo'
import { DesktopHeader } from './components/DesktopHeader'
import { MobileHeader } from './components/MobileHeader'

/**
 * Root page header
 */
export default async function Header (): Promise<any> {
  return (
    <div className='max-w-5xl mx-auto px-4 xl:px-0'>
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
export const Logo: React.FC<{ size?: LogoSize, className?: string }> = ({ size = LogoSize.sm, className }) => {
  return (
    <Link href='/'>
      <OpenBetaLogo className={clx(size, className)} />
    </Link>
  )
}
