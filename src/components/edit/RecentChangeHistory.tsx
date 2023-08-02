import React from 'react'
import Link from 'next/link'
import { PlusIcon, UserCircleIcon, MinusIcon, PencilIcon, PencilSquareIcon, MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'

import { ChangesetType, ChangeType, AreaType, ClimbType, OrganizationType, DocumentTypeName } from '../../js/types'

export interface RecentChangeHistoryProps {
  history: ChangesetType[]
}
export default function RecentChangeHistory ({ history }: RecentChangeHistoryProps): JSX.Element {
  return (
    <div className='flex flex-col gap-y-4 w-full'>
      {history.map(changetset => <ChangesetRow key={changetset.id} changeset={changetset} />)}
    </div>
  )
}

interface ChangsetRowProps {
  changeset: ChangesetType
}

const ChangesetRow = ({ changeset }: ChangsetRowProps): JSX.Element => {
  const { createdAt, editedByUser, operation, changes } = changeset

  // @ts-expect-error
  const op = operationLabelMap[operation]
  if (op == null) console.log('#op', operation, changes)
  return (
    <div className='card card-compact w-full bg-base-100 shadow-xl'>
      <div className='card-body'>
        <div className='mx-4 card-actions justify-between items-center align-middle'>
          {op?.icon}
          {op?.badge}
          <div className='text-xs text-base-300'>
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </div>
          <Link className='w-8 h-8' href={`/u/${editedByUser}`}>
            <a>
              <UserCircleIcon className='w-6 h-6' />
            </a>
          </Link>
        </div>
        <div className='mt-4 ml-6'>
          {changes.map(change => (
            <React.Fragment key={change.changeId}>
              <AreaChange {...change} />
              <ClimbChange {...change} />
              <OrganizationChange {...change} />
            </React.Fragment>))}
        </div>
      </div>
    </div>
  )
}

const ClimbChange = ({ changeId, fullDocument, updateDescription, dbOp }: ChangeType): JSX.Element | null => {
  if (fullDocument.__typename !== DocumentTypeName.Climb) {
    return null
  }
  // @ts-expect-error
  const icon = dbOpIcon[dbOp]
  return (
    <div className='py-2 ml-2 flex gap-x-2'>
      <div className='flex gap-2'><span>{icon}</span><span className='badge badge-sm badge-info'>Climb</span></div>

      <div className=''>
        <div className=''>
          {dbOp === 'delete'
            ? <span>{(fullDocument as ClimbType).name}</span>
            : (<Link href={`/climbs/${(fullDocument as ClimbType).id}`}><a className='link link-hover'>{(fullDocument as ClimbType).name}</a></Link>)}
        </div>
        <div className='text-xs text-base-300'>
          <UpdatedFields fields={updateDescription?.updatedFields} doc={fullDocument as ClimbType} />
        </div>
      </div>
      {/* <div className='row-span-2 col-span-2'>{JSON.stringify(updateDescription?.updatedFields)}</div> */}
    </div>
  )
}

const AreaChange = ({ changeId, fullDocument, updateDescription, dbOp }: ChangeType): JSX.Element | null => {
  if (fullDocument.__typename !== DocumentTypeName.Area) {
    return null
  }
  const url = `/crag/${(fullDocument as AreaType).uuid}`
  // @ts-expect-error
  const icon = dbOpIcon[dbOp]
  return (
    <div className='py-2 ml-2 flex gap-x-2'>
      <div className='flex gap-2'>{icon} <span className='badge badge-sm badge-warning'>Area</span></div>

      <div className=''>
        <div className=''>
          {dbOp === 'delete'
            ? <span>{(fullDocument as AreaType).areaName}</span>
            : (<Link href={url}><a className='link link-hover'>{(fullDocument as AreaType).areaName}</a></Link>)}
        </div>
        <div className='text-xs text-base-300'>
          <UpdatedFields fields={updateDescription?.updatedFields} doc={fullDocument as AreaType} />
        </div>
      </div>
    </div>
  )
}

const OrganizationChange = ({ changeId, fullDocument, updateDescription, dbOp }: ChangeType): JSX.Element | null => {
  if (fullDocument.__typename !== DocumentTypeName.Organization) {
    return null
  }
  // @ts-expect-error
  const icon = dbOpIcon[dbOp]
  return (
    <div className='py-2 ml-2 flex gap-x-2'>
      <div className='flex gap-2'>{icon} <span className='badge badge-sm badge-warning'>Organization</span></div>

      <div className=''>
        <div className=''>
          <span>{(fullDocument as OrganizationType).displayName}</span>
        </div>
        <div className='text-xs text-base-300'>
          <UpdatedFields fields={updateDescription?.updatedFields} doc={fullDocument as OrganizationType} />
        </div>
      </div>
    </div>
  )
}

interface UpdatedFieldsProps {
  fields: string[] | undefined
  doc: any
}
const UpdatedFields = ({ fields, doc }: UpdatedFieldsProps): JSX.Element | null => {
  if (fields == null) return null
  return (
    <div>{fields.map(field => {
      if (field.startsWith('_change')) return null
      if (field.startsWith('updatedAt')) return null
      if (field.startsWith('updatedBy')) return null
      if (field.startsWith('_deleting')) return null
      if (field.includes('children')) return null

      // single access - doc[attr]
      if (field in doc) {
        const value = JSON.stringify(doc[field])
        return (<div key={field}>{field} -&gt; {value}{field.includes('length') ? 'm' : ''}</div>)
      }

      // double access - doc[parent][child]
      if (field.includes('.')) {
        var [parent, child] = field.split('.')
        if (parent === 'content' && doc.__typename === DocumentTypeName.Area) {
          parent = 'areaContent' // I had to alias this in the query bc of the overlap with ClimbType
        }
        if (parent in doc && child in doc[parent]) {
          const value = JSON.stringify(doc[parent][child])
          return (<div key={field}>{child} -&gt; {value}</div>)
        }
        return (<div key={field}>{child}</div>)
      }

      return null
    })}
    </div>
  )
}

interface ActionIconProps {
  icon: JSX.Element
  clz?: 'bg-primary' | 'bg-info' | 'bg-warning' | 'bg-success' | 'bg-error'
}
const ActionIcon = ({ icon, clz }: ActionIconProps): JSX.Element => (
  <div className={`bg-opacity-60 rounded-full border border-base-300 p-2 ${clz ?? ''}`}>{icon}</div>
)

interface OpBadgeProps {
  label: string
  clz?: string
}

const OpBadge = ({ label, clz = 'badge-outline' }: OpBadgeProps): JSX.Element => <span className={`badge ${clz}`}>{label}</span>

const operationLabelMap = {
  addArea: {
    badge: <OpBadge label='Add Area' clz='badge-warning' />,
    icon: <ActionIcon icon={<PlusIcon className='w-6 h-6 stroke-base-300 stroke-2' />} clz='bg-success' />
  },
  updateArea: {
    badge: <OpBadge label='Update Area' clz='badge-warning' />,
    icon: <ActionIcon icon={<PencilIcon className='w-6 h-6 stroke-base-300' />} />
  },
  addCountry: {
    badge: <OpBadge label='Add Country' clz='badge-primary' />,
    icon: <ActionIcon icon={<PlusIcon className='w-6 h-6 stroke-base-300' />} />
  },
  deleteArea: {
    badge: <OpBadge label='Delete Area' clz='badge-warning' />,
    icon: <ActionIcon icon={<MinusIcon className='w-6 h-6 stroke-base-300' />} clz='bg-error' />
  },
  updateDestination: {
    badge: <OpBadge label='Area' clz='badge-warning' />,
    icon: <ActionIcon icon={<PencilIcon className='w-6 h-6 stroke-base-300' />} />
  },

  addClimb: {
    badge: <OpBadge label='Add Climb' clz='badge-info' />,
    icon: <ActionIcon icon={<PlusIcon className='w-6 h-6 stroke-base-300 stroke-2' />} clz='bg-success' />
  },
  deleteClimb: {
    badge: <OpBadge label='Delete Climb' clz='badge-info' />,
    icon: <ActionIcon icon={<PencilIcon className='w-6 h-6 stroke-base-300' />} clz='bg-error' />
  },
  updateClimb: {
    badge: <OpBadge label='Update Climb' clz='badge-info' />,
    icon: <ActionIcon icon={<PencilIcon className='w-6 h-6 stroke-base-300' />} />
  },
  addOrganization: {
    badge: <OpBadge label='Add Organization' clz='badge-warning' />,
    icon: <ActionIcon icon={<PlusIcon className='w-6 h-6 stroke-base-300 stroke-2' />} clz='bg-success' />
  },
  updateOrganization: {
    badge: <OpBadge label='Update Organization' clz='badge-warning' />,
    icon: <ActionIcon icon={<PencilIcon className='w-6 h-6 stroke-base-300' />} />
  },
  deleteOrganization: {
    badge: <OpBadge label='Delete Organization' clz='badge-warning' />,
    icon: <ActionIcon icon={<MinusIcon className='w-6 h-6 stroke-base-300' />} clz='bg-error' />
  }
}

const dbOpIcon = {
  insert: <PlusCircleIcon className='w-4 h-4 stroke-base-300' />,
  update: <PencilSquareIcon className='w-4 h-4 stroke-base-300' />,
  delete: <MinusCircleIcon className='w-4 h-4 fill-error' />
}
