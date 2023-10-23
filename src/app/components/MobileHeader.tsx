'use client'
import { useSession } from 'next-auth/react'
import { Logo } from 'app/header'
import { XSearchMinimal } from '@/components/search/XSearch'
import { AuthenticatedNav13, LoginButton, More } from '@/components/MobileAppBar'

export const MobileHeader: React.FC = () => {
  const { status } = useSession()
  const nav = status === 'authenticated' ? <AuthenticatedNav13 /> : <LoginButton />
  return (
    <header className='flex lg:hidden items-center justify-between gap-6'>
      <Logo />
      <XSearchMinimal />
      {nav}
      <More />
    </header>
  )
}
