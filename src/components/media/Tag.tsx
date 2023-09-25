import Link from 'next/link'
import { XCircleIcon } from '@heroicons/react/20/solid'
import NetworkSquareIcon from '../../assets/icons/network-square-icon.svg'

import clx from 'classnames'
import { EntityTag, TagTargetType } from '../../js/types'
import { OnDeleteCallback } from './TagList'
import { MouseEventHandler } from 'react'

const stopPropagation: MouseEventHandler = (event) => event.stopPropagation()

const baseTag = 'badge badge-outline hover:underline max-w-full'
const lgTag = 'badge-lg gap-2'
const mdTag = 'gap-1'
const sizeMap = { md: mdTag, lg: lgTag }

interface BaseTagProps {
  size?: 'md' | 'lg'
  url?: string
  className?: string
  children: React.ReactNode
}

/**
 * Base tag component that can be used to create other tag components.
 * Clicking on it leads to the url provided.
 * @param {BaseTagProps} props - Properties for the BaseTag component
 */
export const BaseTag: React.FC<BaseTagProps> = ({ size = 'md', url, className, children }) => {
  return (
    <div className='w-full' data-testid='base-tag'>
      <Link href={url ?? '#'} prefetch={false}>
        <a
          data-testid='base-tag-link'
          onClick={stopPropagation}
          className={clx(baseTag, sizeMap[size], className)}
        >
          {children}
        </a>
      </Link>
    </div>
  )
}

interface LocationTagProps {
  mediaId: string
  tag: EntityTag
  onDelete: OnDeleteCallback
  isAuthorized?: boolean
  showDelete?: boolean
  size?: 'md' | 'lg'
}

/**
 * Tag associated with specific locations, such as climbs or areas.
 * If isAuthorized is true, a delete button will be displayed.
 * @param {LocationTagProps} props - Properties for the LocationTag component
 */
export const LocationTag: React.FC<LocationTagProps> = ({ mediaId, tag, onDelete, size = 'md', showDelete = false, isAuthorized = false }) => {
  const [url, name] = resolver(tag)
  if (url == null || name == null) return null
  const isArea = tag.type === TagTargetType.area

  return (
    <BaseTag url={url} size={size} className={isArea ? 'badge-info bg-opacity-60' : 'badge-outline'}>
      {isArea && <div className='h-6 w-6 grid place-content-center'><NetworkSquareIcon className='w-6 h-6' /></div>}
      <div className='mt-0.5 whitespace-nowrap truncate text-sm'>{name}</div>
      {isAuthorized && showDelete &&
        <button
          onClick={(e) => {
            e.preventDefault()
            void onDelete({ mediaId, tagId: tag.id, entityId: tag.targetId, entityType: tag.type })
          }}
          title='Delete tag'
        >
          <div className='rounded-full -mr-2.5'>
            <XCircleIcon className='cursor-pointer stroke-1 hover:stroke-2 w-5 h-5' />
          </div>
        </button>}
    </BaseTag>
  )
}

interface UsernameTagProps {
  username: string
  size?: 'md' | 'lg'
}

/**
 * Tag that display a username.
 * Clicking on it leads to the user's profile page.
 * @param {UsernameTagProps} props - Properties for the UsernameTag component
 */
export const UsernameTag: React.FC<UsernameTagProps> = ({ username, size = 'md' }) => {
  if (username === undefined || username.trim() === '') return null

  return (
    <BaseTag url={`/u/${username}`} size={size} className='bg-black border border-gray-900 text-white bg-opacity-70'>
      {username}
    </BaseTag>
  )
}

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
