import Head from 'next/head'

import { INextPageWithAuth } from '../../js/types/INext'
import { Username } from '../../components/users/account/Username'

const edit: INextPageWithAuth = () => {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>

      <div className='h-screen lg:flex lg:justify-center'>
        <div className='hidden lg:block bg-accent/80 w-full' />
        <div className='w-full px-4 lg:px-6 flex items-center'>
          <div className='h-24'><Username /></div>
        </div>
      </div>
    </>
  )
}

edit.auth = true
export default edit
