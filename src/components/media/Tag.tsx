import Link from 'next/link'
import { XCircleIcon } from '@heroicons/react/solid'
import clx from 'classnames'

import { MediaTagWithClimb } from '../../js/types'

interface PhotoTagProps {
  tag: MediaTagWithClimb // only handle climb tag for now
  onDelete: (mediaId: string, destinationId: string) => void
  isAuthorized?: boolean
  showDelete?: boolean
  size?: 'md' | 'lg'
}

export default function Tag ({ tag, onDelete, size = 'md', showDelete = false, isAuthorized = false }: PhotoTagProps): JSX.Element {
  const { climb } = tag
  return (
    <Link href={`/climbs/${climb.id}`} prefetch={false}>
      <a
        className={clx('badge badge-outline hover:underline',
          size === 'lg' ? 'badge-lg gap-2' : 'gap-1')}
        onClick={stopPropagation}
      >
        <span className='whitespace-nowrap truncate text-sm'>{climb.name}</span>
        {isAuthorized && showDelete &&
          <button onClick={(e) => {
            onDelete(tag.mediaUuid, tag.climb.id)
            e.preventDefault()
          }}
          >
            <div className='hover:bg-white rounded-full'>
              <XCircleIcon className={clx('cursor-pointer stroke-1 hover:stroke-2', size === 'lg' ? 'w-6 h-6' : 'w-5 h-5')} />
            </div>
          </button>}
      </a>
    </Link>

  )
}

const stopPropagation = (event): void => event.stopPropagation()
