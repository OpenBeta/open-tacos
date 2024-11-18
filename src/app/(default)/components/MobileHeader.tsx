'use client'
import { useSession } from 'next-auth/react'
import { Logo } from '../header'
import { XSearchMinimal } from '@/components/search/XSearch'
import { LoginButton, More } from '@/components/MobileAppBar'
import AuthenticatedProfileNavButton from '../../../components/AuthenticatedProfileNavButton'

/**
 * Main header for mobile
 */
export const MobileHeader: React.FC = () => {
  const { status } = useSession()
  const nav = status === 'authenticated' ? <AuthenticatedProfileNavButton /> : <LoginButton />
  return (
    <header className='flex lg:hidden items-center justify-between gap-6 py-2'>
      <Logo />
      <XSearchMinimal />
      {nav}
      <More />
    </header>
  )
}
