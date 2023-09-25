import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { formatDistanceToNow } from 'date-fns'
import { useSession, signIn } from 'next-auth/react'
import { OrganizationType, UserRole, RulesType } from '../../js/types'
import { orgsToCsv, saveAsCSVFile } from '../../js/utils/csv'
import CreateUpdateModal from './CreateUpdateModal'
import OrganizationForm from './OrganizationForm'
import { graphqlClient } from '../../js/graphql/Client'
import { OrgInput, QUERY_ORGANIZATIONS } from '../../js/graphql/gql/organization'
import { Input } from '../ui/form'
import { toast } from 'react-toastify'
import { MagnifyingGlassIcon, PencilSquareIcon, PlusIcon } from '@heroicons/react/20/solid'
import { useForm, FormProvider } from 'react-hook-form'

const MIN_LENGTH_VALIDATION: RulesType = {
  minLength: 3
}

export default function Organizations (): JSX.Element {
  const session = useSession()
  useEffect(() => {
    if (session.status === 'loading') {
      return
    }
    if (session.status !== 'authenticated') {
      void signIn('auth0', { callbackUrl: '/basecamp/organizations' })
    }
  }, [session])

  const isAuthorized = session.status === 'authenticated' && session?.data?.user.metadata?.roles?.includes(UserRole.USER_ADMIN)

  return (
    <>
      {!isAuthorized && <div>You're not authorized to view this page.</div>}
      {isAuthorized && <OrganizationTable />}
    </>
  )
}

interface QueryOrganizationsDataType {
  organizations: OrganizationType[]
}

interface HtmlFormProps {
  displayName: string
}

const OrganizationTable = (): JSX.Element => {
  const [modalOpen, setModalOpen] = useState(false)
  const [displayName, setDisplayNameFilter] = useState('')
  const [focussedOrg, setfocussedOrg] = useState<OrganizationType | null>(null)

  // Display name filter
  const form = useForm<HtmlFormProps>({
    mode: 'onBlur',
    defaultValues: {
      displayName: ''
    }
  })

  const { handleSubmit } = form
  const submitHandler = ({ displayName }: HtmlFormProps): void => { setDisplayNameFilter(displayName) }

  // Fetch data
  const input: OrgInput = {
    sort: { updatedAt: -1 },
    limit: 20
  }
  if (displayName !== '') {
    input.filter = { displayName: { match: displayName, exactMatch: false } }
  }
  const { loading, data, error } = useQuery<QueryOrganizationsDataType>(
    QUERY_ORGANIZATIONS,
    {
      variables: input,
      client: graphqlClient
    }
  )

  if (loading) return <div className='my-8'>Loading...</div>
  if (error != null) toast.error(`Unexpected error ${error.message}`)
  const orgs = data?.organizations

  return (
    <div className='my-8'>
      <CreateUpdateModal
        isOpen={modalOpen}
        setOpen={setModalOpen}
        contentContainer={
          <OrganizationForm
            existingOrg={focussedOrg}
            onClose={() => setModalOpen(false)}
          />
        }
      />
      <div className=''>
        <div className='flex items-center justify-between'>
          <h2 className=''>Organizations</h2>
          <div className='flex items-center'>
            <button
              className='btn btn-sm btn-primary my-2 ml-2'
              onClick={() => {
                setfocussedOrg(null)
                setModalOpen(true)
              }}
            >
              <PlusIcon className='w-4 h-4' />
              <span className='ml-2'>Create</span>
            </button>
            <FormProvider {...form}>
              {/* eslint-disable-next-line */}
              <form onSubmit={handleSubmit(submitHandler)} className='flex items-center ml-4'>
                <Input
                  name='displayName'
                  placeholder='Search by display name'
                  className='input input-bordered input-sm w-48'
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
        </div>
        <div className='flex items-center'>
          <div className='w-full'>
            {`${orgs?.length ?? 0} account${orgs?.length === 1 ? '' : 's'}`}
          </div>
          <button
            className='btn btn-xs btn-link my-2 ml-8'
            onClick={() => saveAsCSVFile(orgsToCsv(orgs), 'openbeta_organizations.csv')}
          >
            Download
          </button>
        </div>
      </div>
      <table className='table-auto text-left text-sm'>
        <thead>
          <tr className=''>
            <th className='px-4 py-1'>Idx</th>
            <th className='px-4 py-1'>Display Name</th>
            <th className='px-4 py-1'>OrgId</th>
            <th className='px-4 py-1'>Org Type</th>
            <th className='px-4 py-1'>Email</th>
            <th className='px-4 py-1'>Created</th>
            <th className='px-4 py-1'>Updated</th>
            <th className='px-4 py-1'>Action</th>
          </tr>
        </thead>
        <tbody className=''>
          {orgs?.map((org, index: number) =>
            <OrgRow
              key={org.orgId}
              index={index}
              org={org}
              updateOrg={() => {
                setfocussedOrg(org)
                setModalOpen(true)
              }}
            />
          )}
        </tbody>
      </table>
    </div>
  )
}

interface OrgRowProps {
  index: number
  org: OrganizationType
  updateOrg: () => void
}

const OrgRow = ({ index, org, updateOrg }: OrgRowProps): JSX.Element => {
  // eslint-disable-next-line
  const { displayName, orgType, orgId, content, createdAt, updatedAt } = org
  const { email } = content ?? {}

  return (
    <tr className='hover:bg-slate-100'>
      <td className='px-4 py-1 text-right'>
        {index + 1}
      </td>
      <td className='px-4 py-1'>{displayName}</td>
      <td className='px-4 py-1 break-all'>{orgId}</td>
      <td className='px-4 py-1 break-all'>{orgType}</td>
      <td className='px-4 py-1 break-all'>{email}</td>
      <td className='px-4 py-1'>{createdAt !== undefined ? formatDistanceToNow(createdAt) : null}</td>
      <td className='px-4 py-1'>{updatedAt !== undefined ? formatDistanceToNow(updatedAt) : null}</td>
      <td className='px-4 py-1'>
        <button
          className='btn btn-link btn-xs hover:bg-slate-300'
          onClick={updateOrg}
        ><PencilSquareIcon className='w-4 h-4' />
        </button>
      </td>
    </tr>
  )
}
