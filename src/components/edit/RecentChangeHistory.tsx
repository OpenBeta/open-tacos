import React from 'react'
import Link from 'next/link'
import { PlusIcon, MinusIcon, PencilIcon, PencilSquareIcon, MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { formatDistanceToNowStrict } from 'date-fns'
import clx from 'classnames'

import { ChangesetType, ChangeType, AreaType, ClimbType, OrganizationType, DocumentTypeName } from '../../js/types'

export interface RecentChangeHistoryProps {
  history: ChangesetType[]
}

/**
 * Show all changes
 */
export default function RecentChangeHistory ({ history }: RecentChangeHistoryProps): JSX.Element {
  return (
    <div className='mt-4 flex flex-col gap-y-10 w-full'>
      {history.map(changetset => <ChangesetCard key={changetset.id} changeset={changetset} />)}
    </div>
  )
}

interface ChangsetRowProps {
  changeset: ChangesetType
}

/**
 * A card showing individual changeset
 */
export const ChangesetCard: React.FC<ChangsetRowProps> = ({ changeset }) => {
  const { createdAt, editedByUser, operation, changes } = changeset

  // @ts-expect-error
  const op = operationLabelMap[operation]
  return (
    <div className='block w-full max-w-md'>
      <div className='mb-2 flex items-center justify-between flex-wrap gap-y-1.5'>
        <div className='flex items-center gap-1'>
          <Link className='flex items-center gap-2' href={`/u/${editedByUser}`}>
            <div className='avatar placeholder'>
              <div className='bg-neutral-focus text-neutral-content h-6 rounded-full'>
                {editedByUser[0].toUpperCase()}
              </div>
            </div>
            <span className='text-sm text-base-content/70'>{editedByUser}</span>
          </Link>
          <div className='pl-0.5 text-sm'>{op.badge}</div>
        </div>

        <div className='text-sm text-base-content/70 italic mr-2'>
          {formatDistanceToNowStrict(createdAt, { addSuffix: false })}
        </div>
      </div>
      <div className={clx('border-l-8 card card-compact w-full bg-base-100 border shadow-lg', op.borderCue)}>
        <div className='card-body'>
          <div className='px-2'>
            {changes.map(change => (
              <React.Fragment key={change.changeId}>
                <AreaChange {...change} />
                <ClimbChange {...change} />
                <OrganizationChange {...change} />
              </React.Fragment>))}
          </div>
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
    <div className='ml-2 flex gap-x-2'>
      <div className='flex gap-2'><span>{icon}</span><span className='badge badge-sm badge-info'>Climb</span></div>

      <div className=''>
        <div className=''>
          {dbOp === 'delete'
            ? <span>{(fullDocument as ClimbType).name}</span>
            : (
              <Link
                href={`/climbs/${(fullDocument as ClimbType).id}`}
                className='link link-hover'
              >{(fullDocument as ClimbType).name}
              </Link>)}
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
    <div className='ml-2 flex gap-x-2'>
      <div className='flex gap-2'>{icon} <span className='badge badge-sm badge-warning'>Area</span></div>

      <div className=''>
        <div className=''>
          {dbOp === 'delete'
            ? <span>{(fullDocument as AreaType).areaName}</span>
            : (<Link href={url} className='link link-hover'>{(fullDocument as AreaType).areaName}</Link>)}
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
        let [parent, child] = field.split('.')
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

const operationLabelMap = {
  addArea: {
    borderCue: 'border-l-green-500',
    badge: 'added an area',
    icon: <ActionIcon icon={<PlusIcon className='w-6 h-6 stroke-base-300 stroke-2' />} clz='bg-success' />
  },
  updateArea: {
    borderCue: 'border-l-black',
    badge: 'edited an area',
    icon: <ActionIcon icon={<PencilIcon className='w-6 h-6 stroke-base-300' />} />
  },
  addCountry: {
    borderCue: 'border-l-green-500',
    badge: 'added a country',
    icon: <ActionIcon icon={<PlusIcon className='w-6 h-6 stroke-base-300' />} />
  },
  deleteArea: {
    borderCue: 'border-l-pink-500',
    badge: 'deleted an area',
    icon: <ActionIcon icon={<MinusIcon className='w-6 h-6 stroke-base-300' />} clz='bg-error' />
  },
  updateDestination: {
    badge: 'badge-warning',
    icon: <ActionIcon icon={<PencilIcon className='w-6 h-6 stroke-base-300' />} />
  },

  addClimb: {
    borderCue: 'border-l-green-500',
    badge: 'added a climb',
    icon: <ActionIcon icon={<PlusIcon className='w-6 h-6 stroke-base-300 stroke-2' />} clz='bg-success' />
  },
  deleteClimb: {
    borderCue: 'border-l-pink-500',
    badge: 'deleted a climb',
    icon: <ActionIcon icon={<PencilIcon className='w-6 h-6 stroke-base-300' />} clz='bg-error' />
  },
  updateClimb: {
    borderCue: 'border-l-black',
    badge: 'updated a climb',
    icon: <ActionIcon icon={<PencilIcon className='w-6 h-6 stroke-base-300' />} />
  },
  addOrganization: {
    badge: 'added an organization',
    borderCue: 'border-l-green-500',
    icon: <ActionIcon icon={<PlusIcon className='w-6 h-6 stroke-base-300 stroke-2' />} clz='bg-success' />
  },
  updateOrganization: {
    badge: 'updated an organization',
    borderCue: 'border-l-black',
    icon: <ActionIcon icon={<PencilIcon className='w-6 h-6 stroke-base-300' />} />
  },
  deleteOrganization: {
    badge: 'deleted an organization',
    borderCue: 'border-l-pink-500',
    icon: <ActionIcon icon={<MinusIcon className='w-6 h-6 stroke-base-300' />} clz='bg-error' />
  }
}

const dbOpIcon = {
  insert: <PlusCircleIcon className='w-4 h-4 stroke-base-300' />,
  update: <PencilSquareIcon className='w-4 h-4 stroke-base-300' />,
  delete: <MinusCircleIcon className='w-4 h-4 fill-error' />
}
