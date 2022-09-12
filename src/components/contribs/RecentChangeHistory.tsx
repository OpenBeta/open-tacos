import { PlusIcon, UserCircleIcon, MinusIcon, PencilIcon } from '@heroicons/react/outline'
import { formatDistanceToNow } from 'date-fns'

import { ChangesetType } from '../../js/types'

interface RecentChangeHistoryProps {
  history: ChangesetType[]
}
export default function RecentChangeHistory ({ history }: RecentChangeHistoryProps): JSX.Element {
  return (
    <div className='flex flex-col gap-y-4'>
      {history.map(changetset => <ChangesetRow key={changetset.id} changeset={changetset} />)}
    </div>
  )
}

interface ChangsetRowProps {
  changeset: ChangesetType
}

const ChangesetRow = ({ changeset }: ChangsetRowProps): JSX.Element => {
  const { createdAt, operation } = changeset

  const op = operationLabelMap[operation]
  return (
    <div className='card card-compact w-96 bg-base-100 shadow-xl'>
      <div className='card-body'>
        <div className='card-actions justify-between items-center align-middle'>
          {op?.icon}
          {op?.badge}
          <div className='text-xs text-base-300'>
            {formatDistanceToNow(createdAt)}
          </div>
          <div className='w-8 h-8'>
            <UserCircleIcon className='w-6 h-6' />
          </div>

        </div>
      </div>
    </div>
  )
}

interface ActionIconProps {
  icon: JSX.Element
  clz?: 'bg-info' | 'bg-warning' | 'bg-success'
}
const ActionIcon = ({ icon, clz = 'bg-success' }: ActionIconProps): JSX.Element => (
  <span className={`bg-opacity-30 rounded-full p-2 ${clz}`}>
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
    icon: <ActionIcon icon={<MinusIcon className='w-6 h-6 stroke-base-300' />} clz='bg-warning' />
  },
  updateDestination: {
    badge: <OpBadge label='Area' />,
    icon: <ActionIcon icon={<PencilIcon className='w-6 h-6 stroke-base-300' />} clz='bg-info' />
  }
}
