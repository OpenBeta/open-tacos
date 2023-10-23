import Link from 'next/link'
import OpenBetaLogo from '@/assets/brand/openbeta-logo'
import { DesktopHeader } from './components/DesktopHeader'
import { MobileHeader } from './components/MobileHeader'

export default async function Header (): Promise<any> {
  return (
    <div className='max-w-5xl mx-auto px-4 xl:px-0'>
      <MobileHeader />
      <DesktopHeader />
    </div>
  )
}

export const Logo: React.FC = () => {
  return (
    <Link href='/' className='' legacyBehavior>
      <OpenBetaLogo />
    </Link>
  )
}
