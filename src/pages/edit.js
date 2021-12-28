import React from 'react'
import { withAuthenticationRequired } from '@auth0/auth0-react'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Editor from '../components/editor/Editor'

const edit = () => {
  return (
    <Layout
      layoutClz='layout-edit'
      customClz='bg-gradient-to-r from-pink-400 via-yellow-300 to-green-400'
    >
      <SEO keywords={['openbeta', 'rock climbing', 'open data']} title='Edit' />
      <Editor />
    </Layout>
  )
}

export default withAuthenticationRequired(edit)
