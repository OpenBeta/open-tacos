import Link from 'next/link'
import { XCircleIcon } from '@heroicons/react/20/solid'
import NetworkSquareIcon from '../../assets/icons/network-square-icon.svg'

import clx from 'classnames'
import { EntityTag, TagTargetType } from '../../js/types'

interface PhotoTagProps {
  tag: EntityTag
  onDelete: (tagId: string) => void
  isAuthorized?: boolean
  showDelete?: boolean
  size?: 'md' | 'lg'
}

export default function Tag ({ tag, onDelete, size = 'md', showDelete = false, isAuthorized = false }: PhotoTagProps): JSX.Element | null {
  const [url, name] = resolver(tag)
  if (url == null || name == null) return null
  const isArea = tag.type === TagTargetType.area

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
              onDelete(tag.targetId)
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
 * @param tag
 * @returns [url, name]
 */
export const resolver = (props: EntityTag): [string, string] | [null, null] => {
  if (props == null) return [null, null]
  const { targetId: id, climbName, areaName, type } = props
  switch (type) {
    case TagTargetType.climb: {
      return [`/climbs/${id}`, climbName ?? '']
    }
    case TagTargetType.area: {
      return [`/crag/${id}`, areaName]
    }
    default: return [null, null]
  }
}
