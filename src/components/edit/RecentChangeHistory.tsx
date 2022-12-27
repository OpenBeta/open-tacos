import React from 'react'
import Link from 'next/link'
import { PlusIcon, UserCircleIcon, MinusIcon, PencilIcon, PencilSquareIcon, MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'

import { ChangesetType, ChangeType, AreaType, ClimbType } from '../../js/types'

interface RecentChangeHistoryProps {
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
  const { createdAt, operation, changes } = changeset

  const op = operationLabelMap[operation]
  if (op == null) console.log('#op', operation, changes)
  return (
    <div className='card card-compact w-full bg-base-100 shadow-xl'>
      <div className='card-body'>
        <div className='card-actions justify-between items-center align-middle'>
          {op?.icon}
          {op?.badge}
          <div className='text-xs text-base-300'>
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </div>
          <div className='w-8 h-8'>
            <UserCircleIcon className='w-6 h-6' />
          </div>
        </div>
        <div className='mt-4 ml-6'>
          {changes.map(change => (
            <React.Fragment key={change.changeId}>
              <AreaChange {...change} />
              <ClimbChange {...change} />
            </React.Fragment>))}
        </div>
      </div>
    </div>
  )
}

const ClimbChange = ({ changeId, fullDocument, updateDescription, dbOp }: ChangeType): JSX.Element | null => {
  if ((fullDocument as ClimbType)?.name == null) {
    return null
  }
  const { name, id } = fullDocument as ClimbType

  return (
    <div className='py-2 ml-2 flex gap-x-2'>
      <div className='flex gap-2'><span>{dbOpIcon[dbOp]}</span><span className='badge badge-sm badge-info'>Climb</span></div>

      <div className=''>
        <div className=''>
          {dbOp === 'delete'
            ? <span>{name}</span>
            : (<Link href={`/climbs/${id}`}><a className='link link-hover'>{name}</a></Link>)}
        </div>
        <div className='text-xs text-base-300'>
          <UpdatedFields fields={updateDescription?.updatedFields} />
        </div>
      </div>
      {/* <div className='row-span-2 col-span-2'>{JSON.stringify(updateDescription?.updatedFields)}</div> */}
    </div>
  )
}

const AreaChange = ({ changeId, fullDocument, updateDescription, dbOp }: ChangeType): JSX.Element | null => {
  // @ts-expect-error
  // eslint-disable-next-line
  if (fullDocument?.areaName == null) {
    return null
  }
  const { areaName, uuid, metadata } = fullDocument as AreaType

  const url = metadata.leaf ? `/crag/${uuid}` : `/areas/${uuid}`

  return (
    <div className='ml-2 flex gap-x-2'>
      <div className='flex gap-2'>{dbOpIcon[dbOp]} <span className='badge badge-sm badge-warning'>Area</span></div>

      <div className=''>
        <div className=''>
          {dbOp === 'delete'
            ? <span>{areaName}</span>
            : (<Link href={url}><a className='link link-hover'>{areaName}</a></Link>)}
        </div>
        <div className='text-xs text-base-300'>
          <UpdatedFields fields={updateDescription?.updatedFields} />
        </div>
      </div>
    </div>
  )
}

interface UpdatedFieldsProps {
  fields: string[] | undefined
}
const UpdatedFields = ({ fields }: UpdatedFieldsProps): JSX.Element | null => {
  if (fields == null) return null
  return (
    <div>{fields.map(field => {
      if (field.startsWith('_change')) return null
      if (field.startsWith('updatedAt')) return null
      return (<div key={field}>{field}</div>)
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

const OpBadge = ({ label, clz = 'badge-outline' }): JSX.Element => <span className={`badge ${clz}`}>{label}</span>

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
  }
}

const dbOpIcon = {
  insert: <PlusCircleIcon className='w-4 h-4 stroke-base-300' />,
  update: <PencilSquareIcon className='w-4 h-4 stroke-base-300' />,
  delete: <MinusCircleIcon className='w-4 h-4 fill-error' />
}
