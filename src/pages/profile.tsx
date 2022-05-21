import type { NextPage } from 'next'
import Head from 'next/head'

import Layout from '../components/layout'
import { useEffect, useState } from 'react'
import { UserMetadata } from './api/user/metadataClient'
import { Button, ButtonVariant } from '../components/ui/BaseButton'
import { useSession } from 'next-auth/react'
import { withAuth } from '../js/auth'

const Profile: NextPage = () => {
  const [profile, setProfile] = useState<UserMetadata>()
  const { data: session } = useSession()

  useEffect(() => {
    if (session == null) {
      return
    }
    fetch('/api/user/profile')
      .then(async (res) => await res.json())
      .catch(() => ({}))
      .then(setProfile)
      .catch(() => {})
  }, [session])

  const updateProfile = (): void => {
    void fetch('/api/user/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profile)
    })
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>

      <Layout contentContainerClass='content-default with-standard-y-margin'>
        <section>
          <span>Name</span>
          <input
            value={profile?.name ?? ''}
            onChange={(e) =>
              setProfile((profile) => ({ ...profile, name: e.target.value }))}
          />
          <Button variant={ButtonVariant.SOLID_DEFAULT} label='Update' onClick={updateProfile} />
        </section>
      </Layout>
    </>
  )
}
export default withAuth(Profile)
