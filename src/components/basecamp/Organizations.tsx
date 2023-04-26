import React, { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useSession, signIn } from 'next-auth/react'
import { OrganizationContentType, OrganizationType } from '../../js/types'
import { usersToCsv, saveAsCSVFile } from '../../js/utils/csv'
import CreateUpdateModal from './CreateUpdateModal'
import OrganizationForm from './OrganizationForm'
import { getOrganizations } from '../../js/graphql/api'

export default function Organizations (): JSX.Element {
  const session = useSession()
  useEffect(() => {
    if (session.status === 'loading') {

    } else if (session.status !== 'authenticated') {
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
  const [orgs, setOrgs] = useState<OrganizationType[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [focussedOrg, setfocussedOrg] = useState<OrganizationType | null>(null)

  useEffect(() => {
    void getOrganizations()
      .then((orgs) => {
        console.log('getAllOrs res', orgs)
        setOrgs(orgs)
      })
  }, [])

  return (
    <div className='my-8'>
      <CreateUpdateModal
        isOpen={modalOpen}
        setOpen={setModalOpen}
        contentContainer={
          <OrganizationForm
            existingOrg={focussedOrg}
            onClose={(org: OrganizationType | null) => {
              if (org != null) {
                const updatedOrgs = [
                  org,
                  ...orgs.filter(o => o.orgId !== org.orgId)
                ]
                setOrgs(updatedOrgs)
              }
              setModalOpen(false)
            }}
          />
        }
      />
      <div className='flex flex-row justify-between items-center border-b border-t border-primary'>
        <h2>Organizations: {orgs?.length}</h2>
        <div>
          <button
            className='btn btn-sm btn-outline my-2'
            onClick={() => saveAsCSVFile(usersToCsv(orgs), 'openbeta_organizations.csv')}
          >
            Download
          </button>
          <button
            className='btn btn-sm btn-secondary my-2 ml-2'
            onClick={() => setModalOpen(true)}
          >
            + Create
          </button>
        </div>
      </div>
      <div className='mt-8 w-full grid grid-cols-7 gap-4 justify-items-start items-center text-sm'>
        <div className='' />
        <div className='col-span-1 w-full bg-pink-200'>Display Name</div>
        <div className='col-span-1 w-full bg-pink-200'>OrgId</div>
        <div className='col-span-1 w-full bg-pink-200'>Org Type</div>
        <div className='col-span-1 w-full bg-pink-200'>Email</div>
        <div className='col-span-1 w-full bg-yellow-200'>Created</div>
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
  const { displayName, orgType, orgId, content, createdAt } = org
  const { email } = content as OrganizationContentType

  return (
    <>
      <div>
        {index + 1}
      </div>
      <div className='col-span-1 w-full'>{displayName}</div>
      <div className='col-span-1 w-full'>{orgId}</div>
      <div className='col-span-1 w-full break-words'>{orgType}</div>
      <div className='col-span-1 w-full'>{email}</div>
      <div className='col-span-1 w-full'>{createdAt !== undefined ? formatDistanceToNow(createdAt) : null}</div>
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
