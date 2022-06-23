import classNames from 'classnames'
import Link from 'next/link'
import { XIcon } from '@heroicons/react/outline'

import { MediaTagWithClimb } from '../../js/types'

interface PhotoTagProps {
  highlighted: boolean
  tag: MediaTagWithClimb // only handle climb tag for now
  onDelete: (mediaId: string, destinationId: string) => void
  isAuthorized?: boolean
}

export default function Tag ({ tag, highlighted, onDelete, isAuthorized = false }: PhotoTagProps): JSX.Element {
  const { climb } = tag
  return (
    <Link href={`/climbs/${climb.id}`}>
      <a
        className={classNames(
          'border-neutral-400 border rounded-full max-w-[10rem] inline-flex items-center hover:underline',
          highlighted ? 'bg-neutral-200 ' : ''
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <span className='px-2 whitespace-nowrap truncate'>{climb.name}</span>
        {isAuthorized &&
          <button onClick={(e) => {
            onDelete(tag.mediaUuid, tag.climb.id)
            e.preventDefault()
          }}
          >
            <div className=' hover:bg-white p-1 rounded-full'>
              <XIcon className='cursor-pointer stroke-1 hover:stroke-2 w-5 h-5' />
            </div>
          </button>}
      </a>
    </Link>

  )
}
