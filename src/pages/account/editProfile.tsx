import { NextPage } from 'next'
import Head from 'next/head'

import { UpdateProfileForm } from '../../components/users/account/UpdateProfileForm'
import { AccountLayout } from '../../components/users/account/AccountLayout'

const changeUsername: NextPage = () => {
  return (
    <>
      <Head>
        <title>Edit profile</title>
      </Head>
      <AccountLayout form={<UpdateProfileForm />} />
    </>
  )
}

export default changeUsername
