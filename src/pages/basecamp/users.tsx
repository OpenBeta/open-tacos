import React from 'react'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import { LinkButton } from '../../components/ui/Button'

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
        <div className='max-w-screen-2xl mx-auto px-4 flex flex-col items-center 2xl:px-8'>
          <div className='flex flex-row w-full'>
            <LinkButton
              href='/basecamp/users'
              className='btn btn-sm'
              buttonProps={{ disabled: true }}
            >
              Users
            </LinkButton>
            <LinkButton
              href='/basecamp/organizations'
              className='btn btn-sm ml-4'
            >
              Organizations
            </LinkButton>
          </div>
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
