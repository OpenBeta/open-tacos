import clx from 'classnames'
import Link from 'next/link'
import Image from 'next/image'

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
    <Link href='/' className='flex items-center gap-2'>
      <OpenBetaLogo className={clx(size, className)} />
      {withText && <span className='font-bold text-lg tracking-tight'>OpenBeta</span>}
    </Link>
  )
}

interface MobileLinkProps {
  link: string
  image: string
  description: string
  className?: string
}

/**
 * Reusable mobile link component
 */
export const MobileLink: React.FC<MobileLinkProps> = ({ link, image, description, className }) => {
  return (
    <Link href={link} rel='noopener noreferrer' target='_blank' passHref className={className}>
      <Image
        src={image}
        alt={description}
        width={125}
        height={37}
        priority
        unoptimized
        style={{
          maxWidth: 'none'
        }}
      />
    </Link>
  )
}
