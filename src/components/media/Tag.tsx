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
    <span className={classNames(
      'px-1 py-0.5 border-neutral-400 bg-neutral-200 border rounded-xl max-w-[10rem] inline-flex items-center',
      highlighted ? 'bg-opacity-100 stroke-gray-800' : 'bg-opacity-30 stroke-neutral-400'
    )}
    >
      <Link href={`/climbs/${climb.id}`} passHref>
        <a className='whitespace-nowrap truncate px-1 hover:underline'>{climb.name}</a>
      </Link>
      {isAuthorized &&
        <button onClick={(e) => {
          onDelete(tag.mediaUuid, tag.climb.id)
          e.stopPropagation()
        }}
        >
          <XIcon className='cursor-pointer w-5 h-5 stroke-1 stroke-inherit hover:stroke-2' />
        </button>}
    </span>
  )
}
