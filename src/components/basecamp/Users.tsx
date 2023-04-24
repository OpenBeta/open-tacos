import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { useSession, signIn } from 'next-auth/react'
import useSWR from 'swr'
import axios from 'axios'
import { UserPage } from 'auth0'

import { userHomeFromUuid } from '../../js/sirv/SirvClient'
import { IUserMetadata } from '../../js/types/User'
import { usersToCsv, saveAsCSVFile } from '../../js/utils/csv'
import Bar from '../ui/Bar'

export default function Users (): JSX.Element {
  const session = useSession()
  useEffect(() => {
    if (session.status === 'loading') {

    }
    /* if (session.status !== 'authenticated') {
      void signIn('auth0', { callbackUrl: '/basecamp/users' })
    } */
  }, [session])

  const isAuthorized = true

  return (
    <>
      {!isAuthorized && <div>You're not authorized to view this page.</div>}
      {isAuthorized && <UserTable />}
      {isAuthorized && <PasswordlessUsers />}
    </>

  )
}

const LinkProfile = ({ nick }: {nick: string}): JSX.Element => <Link href={`/u/${nick}`}><a className='link-primary'>{nick}</a></Link>

const fetcher = async (url: string): Promise<any> => {
  console.log('fetcher', url)
  return (await axios.get(url)).data
}

console.log('usertable')
const UserTable = (): JSX.Element => {
  const [currentPage, setPage] = useState(0)

  const { data: userPage, error } = useSWR<UserPage>(`/api/basecamp/users?page=${currentPage}&type=auth0`, fetcher)
  const totalPages = Math.ceil((userPage?.total ?? 0) / (userPage?.limit ?? 0))

  return (
    <div className='my-8'>
      <h2 className='border-b border-t border-primary'>Users: {userPage?.total}</h2>
      <Bar layoutClass={Bar.JUSTIFY_RIGHT} paddingX={Bar.PX_DEFAULT_LG} className='w-full'><button onClick={() => saveAsCSVFile(usersToCsv(userPage?.users), `openbeta_user_p${currentPage}.csv`)}>Download</button>
      </Bar>
      {error == null && userPage == null && <div>loading...</div>}
      {error != null && <div>{error}</div>}
      <Paginate currentPage={currentPage} totalPages={totalPages} setPage={setPage} />
      <div className='mt-8 w-full grid grid-cols-9 gap-4 justify-items-start items-center text-sm'>
        <div className='' />
        <div className='col-span-2 w-full bg-pink-200'>Email</div>
        <div className='col-span-2 w-full bg-pink-200'>Nickname</div>
        <div className='w-full bg-pink-200'>Uuid</div>
        <div className='w-full bg-pink-200'>Last Login</div>
        <div className='w-full bg-pink-200'>Counts</div>
        <div className='w-full bg-yellow-200'>Created</div>
        {userPage?.users?.map((user, index: number) => <UserRow key={user.user_id} index={index} user={user} />)}
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

const PasswordlessUsers = (): JSX.Element => {
  const [currentPage, setPage] = useState(0)
  const { data: userPage } = useSWR<UserPage>(`/api/basecamp/users?page=${currentPage}&type=email`, fetcher)

  const onClickHandler = async (userId: string): Promise<void> => {
    await axios.get(`/api/basecamp/migrate?id=${userId}`)
  }
  const totalPages = Math.ceil((userPage?.total ?? 0) / (userPage?.limit ?? 0))
  return (
    <div className='mt-8 w-full'>
      <h2 className='border-b border-t border-primary'>Passwordless users: {userPage?.total}</h2>
      <Paginate currentPage={currentPage} totalPages={totalPages} setPage={setPage} />
      <div className='mt-8 w-full grid grid-cols-4 gap-4 justify-items-start items-center text-sm'>
        {userPage?.users?.map((user, index: number) => <UserRowEmail key={user.user_id} index={index} user={user} onClick={onClickHandler} />)}
      </div>

    </div>
  )
}

interface PaginateProps {
  totalPages: number
  currentPage: number
  setPage: React.Dispatch<React.SetStateAction<number>>
}
const Paginate = ({ totalPages, currentPage, setPage }: PaginateProps): JSX.Element => {
  return (
    <div className='flex items-center w-full'>
      <div className='flex items-center gap-x-2'>
        <button
          disabled={currentPage === 0} onClick={() => setPage(prev => prev - 1)}
          className='btn btn-xs btn-outline'
        >Prev
        </button>
        <div>{currentPage + 1} of {totalPages}</div>
        <button
          disabled={currentPage === totalPages - 1} onClick={() => setPage(prev => prev + 1)}
          className='btn btn-xs btn-outline'
        >Next
        </button>
      </div>
    </div>
  )
}

interface UserRowEmailProps extends UserRowProps {
  onClick: (userId: string) => void
}

const UserRowEmail = ({ index, user, onClick }: UserRowEmailProps): JSX.Element => {
  // eslint-disable-next-line
  const { user_metadata, logins_count, user_id: userId, email } = user
  const { uuid } = user_metadata as IUserMetadata ?? { uuid: null }

  return (
    <>
      <div>
        {index + 1} <button className='btn btn-primary btn-solid btn-xs' onClick={() => onClick(userId)}>migrate</button>
      </div>
      <div className=''>{user.email}</div>
      <div className=''>
        {uuid == null ? <span>n/a</span> : <a className='link-primary' href={userHomeFromUuid(uuid)}>{uuid.substring(uuid.length - 5)}</a>}
      </div>
      <div>{logins_count}</div>
    </>
  )
}
