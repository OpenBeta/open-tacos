'use client'
import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { EnvelopeIcon, ArrowSmallRightIcon } from '@heroicons/react/24/outline'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'

export function VerifyEmailPendingContent (): React.JSX.Element {
  const session = useSession()
  const [sending, setSending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('session_token')

  const onClickHandler = async (): Promise<void> => {
    if (token == null) {
      toast.error('Session expired. Please try logging in again.')
      return
    }
    setSending(true)
    try {
      await axios.post(`/api/user/emailVerification?token=${token}`)
      toast.success('Verification email sent! Check your inbox.')
      // Keep button disabled for 3s to prevent spam
      await new Promise(resolve => setTimeout(resolve, 3000))
    } catch {
      toast.error('Failed to send verification email. Please try logging in again.')
    } finally {
      setSending(false)
    }
  }

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
            <button
              disabled={sending}
              className='btn btn-outline'
              onClick={() => { void onClickHandler() }}
            >
              {sending ? 'Sending...' : 'Resend verification email'}
            </button>
            <button className='btn btn-ghost btn-sm text-sm text-base-300' onClick={() => { void signIn('auth0') }}>
              Already verified? Login <ArrowSmallRightIcon className='ml-2 w-5 h-5' />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
