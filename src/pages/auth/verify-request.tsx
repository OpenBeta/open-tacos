import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { EnvelopeIcon, ArrowSmallRightIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import axios from 'axios'
import useSWR from 'swr'

import SeoTags from '../../components/SeoTags'

interface TokenHelperType {
  auth0UserId: string
}

function VerifyEmailPendingPage (): JSX.Element {
  const session = useSession()

  console.log('#verify-request page')

  const [sending, setSending] = useState(false)
  const router = useRouter()
  const token = router.query?.session_token as string

  const url = `/api/user/emailVerification?token=${token}`
  const { error } = useSWR<TokenHelperType>(token != null ? url : null, fetcher, { refreshInterval: 0 })

  const onClickHandler = async (): Promise<void> => {
    if (error == null) {
      setSending(true)
      await axios.post(url)
      // poor man deboucing
      // eslint-disable-next-line
      await new Promise(r => setTimeout(r, 3000))
      setSending(false)
    }
  }

  useEffect(() => {
    // just in case the user has signed in in another browser window.
    // Though `useSession()` refreshes periodically?
    if (session.status === 'authenticated') {
      void router.replace('/')
    }
  }, [session.status, router])

  return (
    <>
      <SeoTags
        title='Email verification pending - OpenBeta'
      />
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
                  className='btn btn-outline' onClick={() => { void onClickHandler }}
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
    </>
  )
}

export default VerifyEmailPendingPage

const fetcher = async (url: string): Promise<any> => (await axios.get(url)).data
