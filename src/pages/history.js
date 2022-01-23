import React, { useEffect, useState } from 'react'

import { GithubClient } from '../js/GithubClient'
import { transform } from '../components/dashboard/EditHistory'
import SeoTags from '../components/SeoTags'
import Layout from '../components/layout'
import ChangeHistory from '../components/ChangeHistory'

/**
 * Show recent edits
 */
const History = () => {
  const [commits, setCommits] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const gitApiAsync = async () => {
      setLoading(true)
      const github = new GithubClient({})
      try {
        const list = await github.getAllCommits()
        setLoading(false)
        setCommits(transform(list))
      } catch (e) {
        setLoading(false)
        console.log('# Network error', e)
      }
    }
    gitApiAsync()
  }, [])

  return (
    <Layout>
      <SeoTags
        keywords={['openbeta', 'rock climbing', 'climbing api']}
        title='History'
      />
      <div>
        <div className='mt-8 h1'>Recent edits</div>
        <ChangeHistory commits={commits} loading={loading} />
      </div>
    </Layout>
  )
}

export default History
