import React from 'react'
import Link from 'next/link'
import { NextPage, GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import { formatDistanceToNow, parseISO } from 'date-fns'

import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import { getAllUsersMetadata } from '../../js/auth/ManagementClient'
import { userHomeFromUuid } from '../../js/sirv/SirvClient'
import { IUserMetadata } from '../../js/types/User'
import { saveAsFile } from '../../js/utils'
import Bar from '../../components/ui/Bar'

interface UserHomeProps {
  users: any[]
}

const Users: NextPage<UserHomeProps> = ({ users }) => {
  const session = useSession({ required: true })

  const isAuthorized = session.status === 'authenticated' && session?.data?.user.metadata?.roles?.includes('user_admin')

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
          <h2>User Management</h2>
          <Bar layoutClass={Bar.JUSTIFY_RIGHT} paddingX={Bar.PX_DEFAULT_LG} className='w-full'><button onClick={() => saveAsFile(exportUsers(users), 'tacos_users.txt')}>Download</button></Bar>
          <div className='mt-8 w-full grid grid-cols-9 gap-4 justify-items-start items-center text-sm'>
            <div className='' />
            <div className='col-span-2' />
            <div className='col-span-2' />

            <div className='' />
            <div className='w-full bg-pink-200'>Login</div>
            <div className='w-full bg-pink-200'>Counts</div>
            <div className='w-full bg-yellow-200'>Created</div>

            {isAuthorized
              ? users?.map((user, index) => {
                // eslint-disable-next-line
                const { user_metadata, last_login, created_at, logins_count, user_id } = user

                const { nick, uuid } = user_metadata as IUserMetadata ?? { nick: null, uuid: null }
                return (
                  <React.Fragment key={user_id}>
                    <div>{index}</div>
                    <div className='col-span-2'>{user.email}</div>
                    <div className='col-span-2'>{nick == null ? 'n/a' : <LinkProfile nick={nick} />}</div>
                    <div className=''>
                      {uuid == null ? <span>n/a</span> : <a className='link-primary' href={userHomeFromUuid(uuid)}>{uuid.substring(uuid.length - 5)}</a>}
                    </div>
                    <div>{formatDistanceToNow(parseISO(last_login))}</div>
                    <div>{logins_count}</div>
                    <div>{formatDistanceToNow(parseISO(created_at))}</div>

                  </React.Fragment>
                )
              })
              : (<div className=''>Not authorized</div>)}
          </div>
        </div>
      </Layout>
    </>

  )
}

export default Users

const LinkProfile = ({ nick }: {nick: string}): JSX.Element => <Link href={`/u/${nick}`}><a className='link-primary'>{nick}</a></Link>

const exportUsers = (users: any[]): string => {
  return users.map(u => u.email).join('\n')
}

export const getStaticProps: GetStaticProps<UserHomeProps, {}> = async ({ params }) => {
  try {
    const users = await getAllUsersMetadata(true)
    const data = {
      users
    }
    return {
      props: data
    }
  } catch (e) {
    console.log('Error in getStaticProps()', e)
    return {
      notFound: true
    }
  }
}
