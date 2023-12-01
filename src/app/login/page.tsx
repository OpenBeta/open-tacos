'use client'
import { useEffect } from 'react'
import { useSearchParams, redirect } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'

export default function Page (): any {
  const { status } = useSession()
  const searchParams = useSearchParams()
  useEffect(() => {
    if (status === 'authenticated') {
      const url = searchParams.get('callbackUrl') ?? '/'
      redirect(url)
    }
    if (status === 'unauthenticated') {
      void signIn('auth0')
    }
  }, [status])
  return <div className='h-screen w-screen'><div className='m-6 text-sm'>Authenticating...</div></div>
}
