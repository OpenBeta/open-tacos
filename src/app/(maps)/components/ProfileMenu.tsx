'use client'
import { SessionProvider } from 'next-auth/react'
import { House } from '@phosphor-icons/react/dist/ssr'
import AuthenticatedProfileNavButton from '@/components/AuthenticatedProfileNavButton'

export const ProfileMenu: React.FC = () => {
  return (
    <SessionProvider>
      <div className='absolute right-4 top-4 z-50'>
        <nav className='flex items-center gap-2'>
          <a className='btn glass' href='/'><House size={18} />Home</a>
          <AuthenticatedProfileNavButton isMobile={false} />
        </nav>
      </div>
    </SessionProvider>
  )
}
