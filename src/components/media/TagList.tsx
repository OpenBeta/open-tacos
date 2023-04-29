import { useState, MouseEventHandler } from 'react'
import classNames from 'classnames'
import { TagIcon, PlusIcon } from '@heroicons/react/24/outline'
import { DropdownMenuItem as PrimitiveDropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { signIn } from 'next-auth/react'

import AddTag from './AddTag'
import { DropdownMenu, DropdownContent, DropdownTrigger, DropdownItem, DropdownSeparator } from '../ui/DropdownMenu'
import useDeleteTagBackend from '../../js/hooks/useDeleteTagBackend'
import { MediaWithTags, SimpleTag } from '../../js/types'
import Tag from './Tag'

interface TagsProps {
  mediaWithTags: MediaWithTags
  isAuthorized?: boolean
  isAuthenticated?: boolean
  showDelete?: boolean
  showActions?: boolean
  className?: string
}

/**
 * A horizontal tag list.  The last item is a CTA.
 */
export default function TagList ({ mediaWithTags, isAuthorized = false, isAuthenticated = false, showDelete = false, showActions = true, className = '' }: TagsProps): JSX.Element | null {
  const { onDelete } = useDeleteTagBackend()
  if (mediaWithTags == null) {
    return null
  }

  const { climbTags, areaTags } = mediaWithTags

  return (
    <div className={
          classNames(
            'text-xs inline-flex flex-wrap justify-start items-center gap-2 overflow-hidden',
            className
          )
          }
    >
      {climbTags.concat(areaTags).map((tag: SimpleTag) =>
        <Tag
          key={`${tag.id}`}
          tag={tag}
          onDelete={onDelete}
          isAuthorized={isAuthorized}
          showDelete={showDelete}
        />)}
      {showActions && isAuthorized &&
        <AddTag
          mediaWithTags={mediaWithTags}
          label={<AddTagBadge />}
        />}
      {showActions && !isAuthenticated &&
        <AddTagBadge onClick={() => { void signIn('auth0') }} />}
    </div>
  )
}

interface TagListProps {
  mediaWithTags: MediaWithTags
  isAuthorized?: boolean
  children?: JSX.Element
}

/**
 * Mobile-first tag list wrapped in a popup menu
 */
export const MobilePopupTagList: React.FC<TagListProps> = ({ mediaWithTags, isAuthorized = false }) => {
  const { onDelete } = useDeleteTagBackend()
  const [openSearch, setOpenSearch] = useState(false)
  const { climbTags, areaTags } = mediaWithTags
  return (
    <div aria-label='tag popup'>
      <DropdownMenu>
        <DropdownTrigger className='btn btn-circle btn-ghost' aria-label='tag menu'>
          <TagIcon className='w-8 h-8' />
        </DropdownTrigger>
        <DropdownContent align='end'>
          <>
            {climbTags.concat(areaTags).map(tag => (
              <PrimitiveDropdownMenuItem key={`${tag.id}`} className='px-2 py-3'>
                <Tag
                  tag={tag}
                  isAuthorized={isAuthorized}
                  onDelete={onDelete}
                  showDelete
                  size='lg'
                />
              </PrimitiveDropdownMenuItem>
            ))}
          </>
          <DropdownSeparator />
          <DropdownItem
            icon={<PlusIcon className='w-5 h-5' />}
            text='Add new tag'
            className='font-bold'
            onSelect={() => {
              if (isAuthorized) {
                setOpenSearch(true)
              } else {
                void signIn('auth0')
              }
            }}
          />
          <DropdownSeparator />
          <DropdownItem text='Cancel' />
        </DropdownContent>
      </DropdownMenu>
      <AddTag
        onCancel={() => setOpenSearch(false)}
        openSearch={openSearch}
        mediaWithTags={mediaWithTags}
        label={<div className='hidden' />}
      />
    </div>
  )
}

interface AddTagBadgeProps {
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const AddTagBadge = ({ onClick = () => {} }: AddTagBadgeProps): JSX.Element =>
  <button className='inline-flex flex-nowrap badge gap-1' onClick={onClick}>
    <PlusIcon className='w-4 h-4 inline-block' /> <span className='whitespace-nowrap'>New tag</span>
  </button>
