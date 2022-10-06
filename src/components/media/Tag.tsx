import classNames from 'classnames'
import Link from 'next/link'
import { XIcon } from '@heroicons/react/outline'

import { MediaTagWithClimb } from '../../js/types'

interface PhotoTagProps {
  tag: MediaTagWithClimb // only handle climb tag for now
  onDelete: (mediaId: string, destinationId: string) => void
  isAuthorized?: boolean
  isMobile?: boolean
}

export default function Tag ({ tag, onDelete, isMobile = true, isAuthorized = false }: PhotoTagProps): JSX.Element {
  const { climb } = tag
  return (
    <Link href={`/climbs/${climb.id}`} prefetch={false}>
      <a
        className='badge badge-outline lg:badge-lg hover:underline gap-x-1 lg:gap-x-2'
        onClick={stopPropagation}
      >
        <span className='whitespace-nowrap truncate text-sm'>{climb.name}</span>
        {isAuthorized && !isMobile &&
          <button onClick={(e) => {
            onDelete(tag.mediaUuid, tag.climb.id)
            e.preventDefault()
          }}
          >
            <div className='hover:bg-white p-1 rounded-full'>
              <XIcon className='cursor-pointer stroke-1 hover:stroke-2 w-5 h-5' />
            </div>
          </button>}
      </a>
    </Link>

  )
}

const stopPropagation = (event): void => event.stopPropagation()
