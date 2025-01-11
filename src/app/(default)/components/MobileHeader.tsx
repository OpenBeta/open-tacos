'use client'
import { useSession } from 'next-auth/react'
import { Logo, MobileLink } from '../header'
import { XSearchMinimal } from '@/components/search/XSearch'
import { LoginButton, More } from '@/components/MobileAppBar'
import AuthenticatedProfileNavButton from '../../../components/AuthenticatedProfileNavButton'
import googlePlay from '@/public/GetItOnGooglePlay_Badge_Web_color.png'

/**
 * Main header for mobile
 */
export const MobileHeader: React.FC = () => {
  const { status } = useSession()
  const nav = status === 'authenticated' ? <AuthenticatedProfileNavButton /> : <LoginButton />
  return (
    <header>
      <div className='flex lg:hidden items-center justify-between gap-6 py-2'>
        <Logo />
        <XSearchMinimal />
        {nav}
        <More />
      </div>
      <div className='flex lg:hidden'>
        <MobileLink
          link='https://play.google.com/store/apps/details?id=io.openbeta'
          description='Get it on Google Play'
          image={googlePlay}
          className='mr-2 mt-1'
        />
      </div>
    </header>
  )
}
