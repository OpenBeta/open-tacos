import React, { useEffect } from 'react'
import {
  ClientSafeProvider,
  getProviders,
  signIn,
  useSession
} from 'next-auth/react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
interface SignInPageProps {
  providers: ClientSafeProvider[]
}

function SignInPage ({ providers }: SignInPageProps): JSX.Element {
  const session = useSession()
  const router = useRouter()
  useEffect(() => {
    if (session.status === 'unauthenticated') {
      void signIn('auth0', { callbackUrl: '/api/user/me' }) // send user to auth0 login screen
    }
    if (session.status === 'authenticated') {
      void router.push('/api/user/me') // send user to profile page
    }
    if (session.status === 'loading') {
      // do nothing
    }
  }, [session])

  return <div>Loading...</div>
}

export async function getServerSideProps (
  context: GetServerSideProps
): Promise<{ props: { providers } }> {
  return { props: { providers: await getProviders() } }
}

export default SignInPage
