import { NextPage } from 'next'
import Head from 'next/head'

import { UpdateProfileForm } from '../../components/users/account/UpdateProfileForm'

const changeUsername: NextPage = () => {
  return (
    <>
      <Head>
        <title>Update profile</title>
      </Head>
      <div className='h-screen lg:flex lg:justify-center'>
        <div className='hidden lg:block bg-accent/80 w-full' />
        <div className='w-full p-4 lg:p-6 flex flex-col justify-center'>
          <UpdateProfileForm />
        </div>
      </div>
    </>
  )
}

export default changeUsername
