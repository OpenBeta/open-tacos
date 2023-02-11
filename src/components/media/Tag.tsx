import Link from 'next/link'
import { XCircleIcon } from '@heroicons/react/20/solid'
import NetworkSquareIcon from '../../assets/icons/network-square-icon.svg'

import clx from 'classnames'
import { HybridMediaTag, MediaTagWithArea, MediaTagWithClimb, TagTargetType } from '../../js/types'

interface PhotoTagProps {
  tag: HybridMediaTag
  onDelete: (tagId: string) => void
  isAuthorized?: boolean
  showDelete?: boolean
  size?: 'md' | 'lg'
}

export default function Tag ({ tag, onDelete, size = 'md', showDelete = false, isAuthorized = false }: PhotoTagProps): JSX.Element | null {
  const [url, name] = resolver(tag)
  if (url == null || name == null) return null
  const isArea = tag.destType === TagTargetType.area

  return (
    <Link href={url} prefetch={false}>
      <a
        className={
          clx('badge hover:underline max-w-full',
            isArea ? 'badge-info bg-opacity-60' : 'badge-outline',
            size === 'lg' ? 'badge-lg gap-2' : 'gap-1')
        }
        onClick={stopPropagation}
        title={name}
      >
        {isArea && <div className='h-6 w-6 grid place-content-center'><NetworkSquareIcon className='w-6 h-6' /></div>}

        <div className='mt-0.5 whitespace-nowrap truncate text-sm'>{name}</div>
        {isAuthorized && showDelete &&
          <button
            onClick={(e) => {
              onDelete(tag.id)
              e.preventDefault()
            }}
            title='Delete tag'
          >
            <div className='rounded-full -mr-2.5'>
              <XCircleIcon className={clx('cursor-pointer stroke-1 hover:stroke-2', size === 'lg' ? 'w-6 h-6' : 'w-5 h-5')} />
            </div>
          </button>}
      </a>
    </Link>

  )
}

const stopPropagation = (event): void => event.stopPropagation()

/**
 * Extract entity url and name from a tag
 * @param tag HybridMediaTag
 * @returns [url, name]
 */
export const resolver = (tag: HybridMediaTag): [string, string] | [null, null] => {
  switch (tag.destType) {
    case TagTargetType.climb: {
      const climb = (tag as MediaTagWithClimb).climb
      if (climb?.id == null) {
        return [null, null]
      }
      return [`/climbs/${climb.id}`, climb.name]
    }
    case TagTargetType.area: {
      const area = (tag as MediaTagWithArea).area
      if (area?.uuid == null) {
        return [null, null]
      }
      return [`/crag/${area.uuid}`, area.areaName]
    }
    default: return [null, null]
  }
}
