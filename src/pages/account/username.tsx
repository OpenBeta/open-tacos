import Head from 'next/head'

import { INextPageWithAuth } from '../../js/types/INext'
import { Username } from '../../components/users/account/Username'

const edit: INextPageWithAuth = () => {
  return (
    <>
      <Head>
        <title>Update username</title>
      </Head>
      <div className='h-screen lg:flex lg:justify-center'>
        <div className='hidden lg:block bg-accent/80 w-full' />
        <div className='w-full p-4 lg:p-6 flex items-center'>
          <Username />
        </div>
      </div>
    </>
  )
}

edit.auth = true
export default edit
