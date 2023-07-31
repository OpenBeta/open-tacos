import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { useSession, signIn } from 'next-auth/react'
import useSWR from 'swr'
import axios from 'axios'
import { UserPage } from 'auth0'

import { MagnifyingGlassIcon, PencilSquareIcon } from '@heroicons/react/20/solid'
import { IUserMetadata, UserRole } from '../../js/types/User'
import { usersToCsv, saveAsCSVFile } from '../../js/utils/csv'
import { CLIENT_CONFIG } from '../../js/configs/clientConfig'
import { Input } from '../ui/form'
import { useForm, FormProvider } from 'react-hook-form'
import type { User } from 'auth0'
import CreateUpdateModal from './CreateUpdateModal'
import UserForm from './UserForm'
import { RulesType } from '../../js/types'

const MIN_LENGTH_VALIDATION: RulesType = {
  minLength: 3
}

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

  const isAuthorized = session.status === 'authenticated' && session?.data?.user.metadata?.roles?.includes(UserRole.USER_ADMIN)

  return (
    <>
      {!isAuthorized && <div>You're not authorized to view this page.</div>}
      {isAuthorized && <UserTable />}
      {isAuthorized && <PasswordlessUsers />}
    </>

  )
}

const LinkProfile = ({ nick }: { nick: string }): JSX.Element => <Link href={`/u/${nick}`}><a className='link-primary'>{nick}</a></Link>

const fetcher = async (url: string): Promise<any> => (await axios.get(url)).data
interface HtmlFormProps {
  email: string
}

const UserTable = (): JSX.Element => {
  const [currentPage, setPage] = useState(0)
  const [emailFilter, setEmailFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [focussedUser, setFocussedUser] = useState<User | null>(null)

  // React-hook-form declaration
  const form = useForm<HtmlFormProps>({
    mode: 'onBlur',
    defaultValues: {
      email: ''
    }
  })
  const { handleSubmit } = form
  const submitHandler = ({ email }: HtmlFormProps): void => { setEmailFilter(email) }

  const { isLoading, data: userPage, error, mutate } = useSWR<UserPage>(`/api/basecamp/users?page=${currentPage}&email=${emailFilter}&type=auth0`, fetcher)
  if (isLoading) return <div className='my-8>'>Loading...</div>

  const totalPages = Math.ceil((userPage?.total ?? 0) / (userPage?.limit ?? 0))

  return (
    <div className='my-4'>
      {(focussedUser != null) &&
        <CreateUpdateModal
          isOpen={modalOpen}
          setOpen={setModalOpen}
          contentContainer={
            <UserForm
              user={focussedUser}
              onClose={() => {
                void mutate() // Likely that modal changed the data, so have SWR refetch it.
                setModalOpen(false)
              }}
            />
          }
        />}
      <div className=''>
        <div className='flex items-center justify-between'>
          <h2 className=''>Users</h2>
          <FormProvider {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                void handleSubmit(submitHandler)(e)
              }}
              className='min-w-[16em]'
            >
              <Input
                name='email'
                placeholder='Search by email'
                className='input input-bordered input-sm'
                registerOptions={MIN_LENGTH_VALIDATION}
              />
              <button
                className='btn btn-round btn-sm ml-2'
                type='submit'
              ><MagnifyingGlassIcon className='w-4 h-4' />
              </button>
            </form>
          </FormProvider>
        </div>
        <div className='flex items-center'>
          <div className='w-full'>{`${userPage?.total ?? 0} account${(userPage?.total ?? 0) === 1 ? '' : 's'}`}</div>
          {totalPages > 1 && <Paginate currentPage={currentPage} totalPages={totalPages} setPage={setPage} />}
          <button
            className='btn btn-xs btn-link my-2 ml-8'
            onClick={() => saveAsCSVFile(usersToCsv(userPage?.users), `openbeta_user_p${currentPage}.csv`)}
          >
            Download CSV
          </button>
        </div>
      </div>
      {error == null && userPage == null && <div>loading...</div>}
      {error != null && <div>{error}</div>}
      <table className='table-auto text-left text-sm'>
        <thead>
          <tr className=''>
            <th className='px-4 py-1'>Idx</th>
            <th className='px-4 py-1'>Email</th>
            <th className='px-4 py-1'>Nickname</th>
            <th className='px-4 py-1'>Uuid</th>
            <th className='px-4 py-1'>Last Login</th>
            <th className='px-4 py-1'>Counts</th>
            <th className='px-4 py-1'>Created</th>
            <th className='px-4 py-1'>Action</th>
          </tr>
        </thead>
        <tbody className=''>
          {userPage?.users?.map((user, index: number) => <UserRow key={user.user_id} index={index} user={user} setFocussedUser={setFocussedUser} setModalOpen={setModalOpen} />)}
        </tbody>
      </table>
    </div>
  )
}
interface UserRowProps {
  index: number
  user: any
  setFocussedUser: (arg0: User) => void
  setModalOpen: (arg0: boolean) => void
}

const UserRow = ({ index, user, setFocussedUser, setModalOpen }: UserRowProps): JSX.Element => {
  // eslint-disable-next-line
  const { user_metadata, last_login, created_at, logins_count, user_id: userId } = user
  const { nick, uuid } = user_metadata as IUserMetadata ?? { nick: null, uuid: null }

  return (
    <tr className='hover:bg-slate-100'>
      <td className='px-4 py-1 text-right'>
        {index + 1}
      </td>
      <td className='px-4 py-1 break-all'>{user.email}</td>
      <td className='px-4 py-1 break-all'>{nick == null ? 'n/a' : <LinkProfile nick={nick} />}</td>
      <td className='px-4 py-1'>
        {uuid == null ? <span>n/a</span> : <a className='link-primary' href={userHomeFromUuid(uuid)}>{uuid.substring(uuid.length - 5)}</a>}
      </td>
      <td className='px-4 py-1'>{last_login != null ? formatDistanceToNow(parseISO(last_login)) : ''}</td>
      <td className='px-4 py-1'>{logins_count}</td>
      <td className='px-4 py-1'>{formatDistanceToNow(parseISO(created_at))}</td>
      <td className='px-4 py-1'>
        <button
          className='btn btn-link btn-xs hover:bg-slate-300'
          onClick={() => {
            setFocussedUser(user)
            setModalOpen(true)
          }}
        ><PencilSquareIcon className='w-4 h-4' />
        </button>
      </td>
    </tr>
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
        {userPage?.users?.map((user, index: number) => <UserRowEmail key={user.user_id} index={index} user={user} onClick={(e) => { void onClickHandler(e) }} />)}
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

interface UserRowEmailProps {
  index: number
  user: any
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

const userHomeFromUuid = (uuid: string): string => `${CLIENT_CONFIG.CDN_BASE_URL}/u/${uuid}`
