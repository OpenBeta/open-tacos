import Link from 'next/link'
import { PlusIcon, UserCircleIcon, MinusIcon, PencilIcon, PlusSmIcon, PencilAltIcon, MinusCircleIcon } from '@heroicons/react/outline'
import { formatDistanceToNow } from 'date-fns'

import { ChangesetType, ChangeType, AreaType } from '../../js/types'

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
        <div className='mt-4'>
          {changes.map(change => <AreaChange key={change.changeId} {...change} />)}
        </div>
      </div>
    </div>
  )
}

const AreaChange = ({ changeId, fullDocument, updateDescription, dbOp }: ChangeType): JSX.Element | null => {
  // @ts-expect-error
  // eslint-disable-next-line
  if (fullDocument?.areaName == null) {
    return null
  }
  const { areaName, uuid } = fullDocument as AreaType

  return (
    <div className='ml-2 flex gap-x-2 items-center'>
      <div>{dbOpIcon[dbOp]}</div>
      {dbOp === 'delete'
        ? <div>{areaName}</div>
        : (<Link href={`/areas/${uuid}`}><a className='link link-hover'>{areaName}</a></Link>)}
    </div>
  )
}

interface ActionIconProps {
  icon: JSX.Element
  clz?: 'bg-info' | 'bg-warning' | 'bg-success' | 'bg-error'
}
const ActionIcon = ({ icon, clz = 'bg-success' }: ActionIconProps): JSX.Element => (
  <span className={`bg-opacity-40 rounded-full p-2 ${clz}`}>
    {icon}
  </span>)

const OpBadge = ({ label, clz = 'badge-outline' }): JSX.Element => <span className={`badge ${clz}`}>{label}</span>

const operationLabelMap = {
  addArea: {
    badge: <OpBadge label='Area' />,
    icon: <ActionIcon icon={<PlusIcon className='w-6 h-6 stroke-base-300' />} />
  },
  addCountry: {
    badge: <OpBadge label='Country' clz='badge-primary' />,
    icon: <ActionIcon icon={<PlusIcon className='w-6 h-6 stroke-base-300' />} />
  },
  deleteArea: {
    badge: <OpBadge label='Area' />,
    icon: <ActionIcon icon={<MinusIcon className='w-6 h-6 stroke-base-300' />} clz='bg-error' />
  },
  updateDestination: {
    badge: <OpBadge label='Area' />,
    icon: <ActionIcon icon={<PencilIcon className='w-6 h-6 stroke-base-300' />} clz='bg-info' />
  }
}

const dbOpIcon = {
  insert: <PlusSmIcon className='w-4 h-4 stroke-base-300' />,
  update: <PencilAltIcon className='w-4 h-4 stroke-base-300' />,
  delete: <MinusCircleIcon className='w-4 h-4 fill-error' />
}
