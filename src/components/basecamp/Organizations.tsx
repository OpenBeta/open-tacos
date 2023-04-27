import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { formatDistanceToNow } from 'date-fns'
import { useSession, signIn } from 'next-auth/react'
import { OrganizationContentType, OrganizationType } from '../../js/types'
import { orgsToCsv, saveAsCSVFile } from '../../js/utils/csv'
import CreateUpdateModal from './CreateUpdateModal'
import OrganizationForm from './OrganizationForm'
import { graphqlClient } from '../../js/graphql/Client'
import { QUERY_ORGANIZATIONS } from '../../js/graphql/gql/organization'
import { toast } from 'react-toastify'

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

  const isAuthorized = session.status === 'authenticated' && session?.data?.user.metadata?.roles?.includes('user_admin')

  return (
    <>
      {!isAuthorized && <div>You're not authorized to view this page.</div>}
      {isAuthorized && <OrganizationTable />}
    </>
  )
}

const OrganizationTable = (): JSX.Element => {
  const [modalOpen, setModalOpen] = useState(false)
  const [focussedOrg, setfocussedOrg] = useState<OrganizationType | null>(null)

  const { data, error } = useQuery(
    QUERY_ORGANIZATIONS,
    {
      variables: {
        /*sort: { updatedAt: 'DESC' },
        limit: 20*/
      },
      client: graphqlClient
    }
  )
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
      <div className='flex flex-row justify-between items-center border-b border-t border-primary'>
        <h2>Organizations: {orgs?.length}</h2>
        <div>
          <button
            className='btn btn-sm btn-outline my-2'
            onClick={() => saveAsCSVFile(orgsToCsv(orgs), 'openbeta_organizations.csv')}
          >
            Download
          </button>
          <button
            className='btn btn-sm btn-secondary my-2 ml-2'
            onClick={() => {
              setfocussedOrg(null)
              setModalOpen(true)
            }}
          >
            + Create
          </button>
        </div>
      </div>
      <div className='mt-8 w-full grid grid-cols-8 gap-4 justify-items-start items-center text-sm'>
        <div className='' />
        <div className='col-span-1 w-full bg-pink-200'>Display Name</div>
        <div className='col-span-1 w-full bg-pink-200'>OrgId</div>
        <div className='col-span-1 w-full bg-pink-200'>Org Type</div>
        <div className='col-span-1 w-full bg-pink-200'>Email</div>
        <div className='col-span-1 w-full bg-yellow-200'>Created</div>
        <div className='col-span-1 w-full bg-yellow-200'>Updated</div>
        <div className='w-full bg-yellow-200'></div>
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
      </div>
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
  const { email } = content as OrganizationContentType

  return (
    <>
      <div>
        {index + 1}
      </div>
      <div className='col-span-1 w-full'>{displayName}</div>
      <div className='col-span-1 w-full'>{orgId}</div>
      <div className='col-span-1 w-full break-words'>{orgType}</div>
      <div className='col-span-1 w-full break-words'>{email}</div>
      <div className='col-span-1 w-full'>{createdAt !== undefined ? formatDistanceToNow(createdAt) : null}</div>
      <div className='col-span-1 w-full'>{updatedAt !== undefined ? formatDistanceToNow(updatedAt) : null}</div>
      <div>
        <button
          className='btn btn-sm btn-outline'
          onClick={updateOrg}
        >
          Update
        </button>
      </div>
    </>
  )
}
