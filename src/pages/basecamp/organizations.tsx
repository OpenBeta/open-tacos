import React from 'react'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import { LinkButton } from '../../components/ui/Button'

interface OrganizationHomeProps {
  users: any[]
}

const Organizations: NextPage<OrganizationHomeProps> = () => {
  return (
    <>
      <SeoTags
        description='Share your climbing adventure photos and contribute to the Wiki.'
        title='Organization Management'
      />

      <Layout
        contentContainerClass='content-default with-standard-y-margin'
        showFilterBar={false}
      >
        <div className='max-w-screen-2xl mx-auto flex flex-col items-center 2xl:px-8'>
          <div className='flex flex-row w-full'>
            <LinkButton
              href='/basecamp/users'
              className='btn btn-sm btn-outline'
            >
              Users
            </LinkButton>
            <LinkButton
              href='/basecamp/organizations'
              className='btn btn-sm btn-outline ml-4'
              buttonProps={{ disabled: true }}
            >
              Organizations
            </LinkButton>
          </div>
          <DynamicOrganizations />
        </div>
      </Layout>
    </>

  )
}

export default Organizations

const DynamicOrganizations = dynamic(async () => await import('../../components/basecamp/Organizations'), {
  ssr: false
})
