import React from 'react'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'

interface UserHomeProps {
  users: any[]
}

const Users: NextPage<UserHomeProps> = () => {
  return (
    <>
      <SeoTags
        description='Share your climbing adventure photos and contribute to the Wiki.'
        title='User Management'
      />

      <Layout
        contentContainerClass='content-default with-standard-y-margin'
        showFilterBar={false}
      >
        <div className='max-w-screen-2xl mx-auto flex flex-col items-center 2xl:px-8'>
          <DynamicUsers />
        </div>
      </Layout>
    </>

  )
}

export default Users

const DynamicUsers = dynamic(async () => await import('../../components/basecamp/Users'), {
  ssr: false
})
