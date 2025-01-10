import clx from 'classnames'
import Link from 'next/link'
import Image from 'next/image'

import OpenBetaLogo from '@/assets/brand/openbeta-logo'
import googlePlay from '@/public/GetItOnGooglePlay_Badge_Web_color_English.png'
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
    <Link href='/' className='flex items-center gap-2'>
      <OpenBetaLogo className={clx(size, className)} />
      {withText && <span className='font-bold text-lg tracking-tight'>OpenBeta</span>}
    </Link>
  )
}

/**
 * Reusable mobile link component
 */
export const MobileLink: React.FC<{ size: number, className?: string }> = ({ size, className }) => {
  return (
    <Link href='https://play.google.com/store/apps/details?id=io.openbeta' rel='noopener noreferrer' target='_blank' passHref className={className}>
      <Image
        src={googlePlay}
        alt='Get it on Google Play'
        height={size}
      />
    </Link>
  )
}
