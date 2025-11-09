'use client'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { EnvelopeIcon, ArrowSmallRightIcon } from '@heroicons/react/24/outline'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import useSWR from 'swr'

interface TokenHelperType {
  auth0UserId: string
}

const fetcher = async (url: string): Promise<TokenHelperType> => (await axios.get(url)).data

export function VerifyEmailPendingContent (): React.JSX.Element {
  const session = useSession()
  const [sending, setSending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('session_token')

  // Memoize URL to avoid recalculation on every render
  const url = useMemo(
    () => `/api/user/emailVerification?token=${token ?? ''}`,
    [token]
  )

  const { error } = useSWR<TokenHelperType>(token != null ? url : null, fetcher, { refreshInterval: 0 })

  // Memoize handler
  const onClickHandler = useCallback(async (): Promise<void> => {
    if (error == null) {
      setSending(true)
      try {
        await axios.post(url)
        // Keep button disabled for 3s to prevent spam
        await new Promise(resolve => setTimeout(resolve, 3000))
      } finally {
        setSending(false)
      }
    }
  }, [error, url])

  // Redirect if already authenticated (e.g., verified in another tab)
  useEffect(() => {
    if (session.status === 'authenticated') {
      router.replace('/')
    }
  }, [session.status, router])

  return (
    <div className='bg-base-content h-screen pt-8'>
      <section className='bg-base-100 max-w-sm mx-auto px-4 py-12 rounded-box'>
        <div className='flex flex-col gap-4 items-center'>
          <EnvelopeIcon className='w-8 h-8 animate-bounce stroke-accent' />
          <hr className='w-full py-1 border-base-300' />
          <div className='text-center'>Look for a verification email in your inbox. <strong>Don't forget to check your spam folder </strong>🙂</div>
          <div className='mt-4 flex flex-col gap-4 items-center w-full'>
            {error == null &&
              <button
                disabled={sending}
                className='btn btn-outline' onClick={() => { void onClickHandler() }}
              >
                Resend verification email
              </button>}
            <button className='btn btn-ghost btn-sm text-sm text-base-300' onClick={() => { void signIn('auth0') }}>
              Already verified? Login <ArrowSmallRightIcon className='ml-2 w-5 h-5' />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
