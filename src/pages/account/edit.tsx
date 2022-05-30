import Head from 'next/head'

import Layout from '../../components/layout'
import { INextPageWithAuth } from '../../js/types/INext'
import ProfileEditForm from '../../components/users/account/ProfileEditForm'

const edit: INextPageWithAuth = () => {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>

      <Layout contentContainerClass='content-default with-standard-y-margin' showFilterBar={false}>
        <section className='mx-auto max-w-screen-sm w-full rounded-md md:border p-0 md:p-16'>
          <ProfileEditForm />
        </section>
      </Layout>
    </>
  )
}

edit.auth = true
export default edit
