import React, { useEffect } from 'react'
import Link from 'next/link'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { useSession, signIn } from 'next-auth/react'
import useSWR from 'swr'
import axios from 'axios'
import { groupBy } from 'underscore'

import { userHomeFromUuid } from '../../js/sirv/SirvClient'
import { IUserMetadata } from '../../js/types/User'
import { saveAsFile } from '../../js/utils'
import Bar from '../ui/Bar'

export default function Users (): JSX.Element {
  const session = useSession()
  useEffect(() => {
    if (session.status === 'loading') {
      return
    }
    if (session.status !== 'authenticated') {
      void signIn('auth0', { callbackUrl: '/basecamp/users' })
    }
  }, [session])

  const isAuthorized = session.status === 'authenticated' && session?.data?.user.metadata?.roles?.includes('user_admin')

  const { data: users, error } = useSWR(isAuthorized ? '/api/basecamp/users' : null, fetcher)

  const groups = groupBy(users, entry => entry.user_id.split('|')[0])
  return (
    <>
      {!isAuthorized && <div>You're not authorized to view this page.</div>}
      {error != null && (<div>Failed to load.</div>)}
      {users == null && isAuthorized && <div>Loading...</div>}
      {users != null && isAuthorized &&
      (
        <>
          <UserTable users={groups.auth0} />
          <PasswordlessUsers users={groups.email} newList={groups.auth0} />
        </>
      )}
    </>

  )
}

const LinkProfile = ({ nick }: {nick: string}): JSX.Element => <Link href={`/u/${nick}`}><a className='link-primary'>{nick}</a></Link>

const exportUsers = (users: any[]): string => {
  return users.map(u => u.email).join('\n')
}

const fetcher = async (url: string): Promise<any> => (await axios.get(url)).data

const UserTable = ({ users }): JSX.Element => {
  return (
    <div className='my-8'>
      <h2 className='border-b border-t border-primary'>Users</h2>
      <Bar layoutClass={Bar.JUSTIFY_RIGHT} paddingX={Bar.PX_DEFAULT_LG} className='w-full'><button onClick={() => saveAsFile(exportUsers(users), 'tacos_users.txt')}>Download</button>
      </Bar>

      <div className='mt-8 w-full grid grid-cols-9 gap-4 justify-items-start items-center text-sm'>
        <div className='' />
        <div className='col-span-2' />
        <div className='col-span-2' />

        <div className='' />
        <div className='w-full bg-pink-200'>Last Login</div>
        <div className='w-full bg-pink-200'>Counts</div>
        <div className='w-full bg-yellow-200'>Created</div>
        {users?.map((user, index: number) => <UserRow key={user.user_id} index={index} user={user} />)}
      </div>
    </div>
  )
}
interface UserRowProps {
  index: number
  user: any
}

const UserRow = ({ index, user }: UserRowProps): JSX.Element => {
  // eslint-disable-next-line
  const { user_metadata, last_login, created_at, logins_count, user_id: userId } = user
  const { nick, uuid } = user_metadata as IUserMetadata ?? { nick: null, uuid: null }

  return (
    <>
      <div>
        {index + 1}
      </div>
      <div className='col-span-2'>{user.email}</div>
      <div className='col-span-2'>{nick == null ? 'n/a' : <LinkProfile nick={nick} />}</div>
      <div className=''>
        {uuid == null ? <span>n/a</span> : <a className='link-primary' href={userHomeFromUuid(uuid)}>{uuid.substring(uuid.length - 5)}</a>}
      </div>
      <div>{last_login != null ? formatDistanceToNow(parseISO(last_login)) : ''}</div>
      <div>{logins_count}</div>
      <div>{formatDistanceToNow(parseISO(created_at))}</div>
    </>
  )
}

const PasswordlessUsers = ({ users, newList }): JSX.Element => {
  const onClickHandler = async (userId: string): Promise<void> => {
    await axios.get(`/api/basecamp/migrate?id=${userId}`)
  }
  return (
    <div className='mt-8 w-full'>
      <h2 className='border-b border-t border-primary'>Passwordless users</h2>
      <div className='mt-8 w-full grid grid-cols-4 gap-4 justify-items-start items-center text-sm'>
        {users?.map((user, index: number) => <UserRowEmail key={user.user_id} index={index} user={user} newList={newList} onClick={onClickHandler} />)}
      </div>

    </div>
  )
}
interface UserRowEmailProps extends UserRowProps {
  onClick: (userId: string) => void
  newList: any[]
}

const UserRowEmail = ({ index, user, newList, onClick }: UserRowEmailProps): JSX.Element => {
  // eslint-disable-next-line
  const { user_metadata, logins_count, user_id: userId, email } = user
  const { uuid } = user_metadata as IUserMetadata ?? { uuid: null }

  const migrated = newList.some(u => u.email === email)
  return (
    <>
      <div>
        {index + 1} <button disabled={migrated} className='btn btn-primary btn-solid btn-xs' onClick={() => onClick(userId)}>migrate</button>
      </div>
      <div className=''>{user.email}</div>
      <div className=''>
        {uuid == null ? <span>n/a</span> : <a className='link-primary' href={userHomeFromUuid(uuid)}>{uuid.substring(uuid.length - 5)}</a>}
      </div>
      <div>{logins_count}</div>
    </>
  )
}
