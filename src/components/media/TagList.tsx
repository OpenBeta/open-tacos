import { useState } from 'react'
import classNames from 'classnames'
import { TagIcon, PlusIcon } from '@heroicons/react/outline'
import { DropdownMenuItem as PrimitiveDropdownMenuItem } from '@radix-ui/react-dropdown-menu'

import AddTag from './AddTag'
import { DropdownMenu, DropdownContent, DropdownTrigger, DropdownItem, DropdownSeparator } from '../ui/DropdownMenu'
import useDeleteTagBackend from '../../js/hooks/useDeleteTagBackend'
import { MediaTagWithClimb, MediaType } from '../../js/types'
import Tag from './Tag'

interface TagsProps {
  list: MediaTagWithClimb[]
  isAuthorized?: boolean
  showDelete?: boolean
  className?: string
  children?: JSX.Element | null
}

/**
 * A horizontal tag list
 * @param children children componenents to be rendered in the same layout as list items
 */
export default function TagList ({ list, isAuthorized = false, showDelete = false, children, className = '' }: TagsProps): JSX.Element | null {
  const { onDelete } = useDeleteTagBackend()
  if (list == null && children == null) {
    return null
  }
  return (
    <div className={
          classNames(
            'text-xs inline-flex flex-wrap justify-start items-center gap-2 ',
            className
          )
          }
    >
      {list.map((tag: MediaTagWithClimb) =>
        <Tag
          key={`${tag.mediaUuid}-${tag.climb.id}`}
          tag={tag}
          onDelete={onDelete}
          isAuthorized={isAuthorized}
          showDelete={showDelete}
        />)}
      {children}
    </div>
  )
}

/**
 * Mobile-first tag list wrapped in a popup menu
 */
export const MobilePopupTagList = ({ list, imageInfo, isAuthorized = false }: TagListProps): JSX.Element => {
  const { onDelete } = useDeleteTagBackend()
  const [openSearch, setOpenSearch] = useState(false)
  return (
    <div aria-label='tag popup'>
      <DropdownMenu>
        <DropdownTrigger className='btn btn-circle btn-ghost' aria-label='tag menu'>
          <TagIcon className='w-8 h-8' />
        </DropdownTrigger>
        <DropdownContent align='end'>
          <>
            {list.map((tag: MediaTagWithClimb) => (
              <PrimitiveDropdownMenuItem key={`${tag.mediaUuid}-${tag.climb.id}`} className='px-2 py-3'>
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
            onSelect={() => setOpenSearch(true)}
          />
          <DropdownSeparator />
          <DropdownItem text='Cancel' />
        </DropdownContent>
      </DropdownMenu>
      <AddTag
        onCancel={() => setOpenSearch(false)}
        openSearch={openSearch}
        imageInfo={imageInfo}
        label={<div className='hidden' />}
      />
    </div>
  )
}

interface TagListProps {
  list: MediaTagWithClimb[]
  isAuthorized?: boolean
  children?: JSX.Element
  imageInfo: MediaType
}
