import { NextPage } from 'next'
import Head from 'next/head'

import { UsernameChangeForm } from '../../components/users/account/UsernameChangeForm'
import { AccountLayout } from '../../components/users/account/AccountLayout'

const changeUsername: NextPage = () => {
  return (
    <>
      <Head>
        <title>Change username</title>
      </Head>
      <AccountLayout form={<UsernameChangeForm />} />
    </>
  )
}

export default changeUsername
