import React, { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

import ChangeHistory from '../../components/ChangeHistory'
import { GithubClient } from '../../js/GithubClient'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

function EditHistory () {
  const { getAccessTokenSilently, user } = useAuth0()
  const [commits, setCommits] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const getAuth0Token = async () => {
      setLoading(true)
      const authToken = await getAccessTokenSilently({
        audience: 'https://git-gateway'
      })

      const author = {
        name: user['https://tacos.openbeta.io/username'],
        email: user['https://tacos.openbeta.io/username'] + '@noreply'
      }

      const github = new GithubClient({ authToken })
      const list = await github.getAllCommits(author.email)
      setLoading(false)
      setCommits(transform(list))
    }

    getAuth0Token()
  }, [getAccessTokenSilently, user])

  return (
    <div className='mt-16'>
      <div className='h1'>My Recent Edits</div>
      <ChangeHistory commits={commits} loading={loading} />
    </div>
  )
}

/**
 * Flatten GitHub response object.
 * See https://docs.github.com/en/rest/reference/repos#list-commits
 * @param {Array} list
 */
export const transform = (list) => {
  if (!list) return []
  const newList = list.map(({ sha, html_url: htmlUrl, commit }) => {
    const { author, message } = commit
    const { date, name } = author
    return { sha, html_url: htmlUrl, date, age: dayjs(date).fromNow(), message, name }
  })
  return newList
}

export default EditHistory
