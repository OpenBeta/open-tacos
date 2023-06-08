import { NextPage } from 'next'
import Head from 'next/head'

import { UsernameChangeForm } from '../../components/users/account/UsernameChangeForm'

const changeUsername: NextPage = () => {
  return (
    <>
      <Head>
        <title>Change username</title>
      </Head>
      <div className='h-screen lg:flex lg:justify-center'>
        <div className='hidden lg:block bg-accent/80 w-full' />
        <div className='w-full p-4 lg:p-6 flex flex-col justify-center'>
          <UsernameChangeForm />
        </div>
      </div>
    </>
  )
}

export default changeUsername
