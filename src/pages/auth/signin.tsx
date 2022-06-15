import React from 'react'
import { getNavBarOffset } from '../../components/Header'
import Layout from '../../components/layout'
import { ClientSafeProvider, getProviders, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { Button, ButtonVariant } from '../../components/ui/BaseButton'

interface SignInPageProps {
  providers: ClientSafeProvider[]
}

const errors = {
  Signin: 'Try signing with a different account.',
  OAuthSignin: 'Try signing with a different account.',
  OAuthCallback: 'Try signing with a different account.',
  OAuthCreateAccount: 'Try signing with a different account.',
  EmailCreateAccount: 'Try signing with a different account.',
  Callback: 'Try signing with a different account.',
  OAuthAccountNotLinked:
    'To confirm your identity, sign in with the same account you used originally.',
  EmailSignin: 'Check your email address.',
  CredentialsSignin:
    'Sign in failed. Check the details you provided are correct.',
  default: 'Unable to sign in.'
}

const SignInError = ({ error }: { error: string | string[] }): JSX.Element => {
  const errorMessage = (errors[(typeof error === 'object') ? error[0] : error] ?? errors.default)

  return (
    <>
      <div className='text-red-800'>There was an error signing you in.</div>
      <div className='mb-5'>{errorMessage}</div>
    </>
  )
}

function SignInPage ({ providers }: SignInPageProps): JSX.Element {
  const navbarOffset = getNavBarOffset()
  const { error } = useRouter().query
  return (
    <Layout contentContainerClass='content-default with-standard-y-margin' showFilterBar={false}>
      <div className='inline-flex flex-col items-center align-middle justify-center h-full' style={{ height: `calc(100vh - ${navbarOffset}px)` }}>
        <h1>Login</h1>
        {/* Error message */}
        {error != null && error && <SignInError error={error} />}
        {/* Login options */}
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <Button
              onClick={async () => await signIn(provider.id)}
              label={
                <>
                  <span className='mt-0.5 pr-4'>Sign in with {provider.name}</span>
                </>
              }
              variant={ButtonVariant.SOLID_PRIMARY}
            />
          </div>
        ))}
      </div>
    </Layout>
  )
}

export async function getServerSideProps (context: GetServerSideProps): Promise<{ props: { providers } }> {
  return { props: { providers: await getProviders() } }
}

export default SignInPage
