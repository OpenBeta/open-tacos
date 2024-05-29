'use client'
import Link from 'next/link'
import { SessionProvider } from 'next-auth/react'
import { House } from '@phosphor-icons/react/dist/ssr'
import AuthenticatedProfileNavButton from '@/components/AuthenticatedProfileNavButton'
import { OnboardingCheck } from '@/components/auth/OnboardingCheck'

export const ProfileMenu: React.FC = () => {
  return (
    <SessionProvider>
      <div className='absolute right-4 top-4 z-40'>
        <nav className='flex items-center gap-2'>
          <Link className='btn glass' href='/'><House size={18} />Home</Link>
          <AuthenticatedProfileNavButton isMobile={false} />
        </nav>
      </div>
      <OnboardingCheck />
    </SessionProvider>
  )
}
