import { useCallback } from 'react'
import classNames from 'classnames'
import { useMutation } from '@apollo/client'
import { TagIcon, PlusIcon } from '@heroicons/react/outline'
import { MUTATION_REMOVE_MEDIA_TAG } from '../../js/graphql/fragments'
import { graphqlClient } from '../../js/graphql/Client'
import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu'

import AddTag from './AddTag'
import { DropdownMenu, DropdownContent, DropdownTrigger, DropdownSeparator } from '../ui/DropdownMenu'
import useDeleteTagBackend from '../../js/hooks/useDeleteTagBackend'
import { MediaTagWithClimb, MediaType } from '../../js/types'
import Tag from './Tag'

interface TagsProps {
  list: MediaTagWithClimb[]
  onDeleted?: (props?: any) => void
  isAuthorized?: boolean
  className?: string
  children?: JSX.Element
}

export default function TagList ({ list, onDeleted, isAuthorized = false, children, className = '' }: TagsProps): JSX.Element {
  const [removeTag] = useMutation(
    MUTATION_REMOVE_MEDIA_TAG, {
      client: graphqlClient,
      onCompleted: onDeleted
    }
  )
  const onDeleteHandler = useCallback(async (mediaUuid, destinationId) => {
    await removeTag({
      variables: {
        mediaUuid,
        destinationId
      }
    })
  }, [])

  return (
    <div className={
          classNames(
            'text-xs inline-flex flex-wrap justify-start items-center bg-white gap-2 ',
            className
          )
          }
    >
      {list.map((tag: MediaTagWithClimb) =>
        <Tag
          key={`${tag.mediaUuid}-${tag.climb.id}`}
          tag={tag}
          onDelete={onDeleteHandler}
          isAuthorized={isAuthorized}
        />)}
      {children}
    </div>
  )
}

export const MenuItems = ({ list, imageInfo, isAuthorized = false }: TagListProps): JSX.Element => {
  const { onDelete } = useDeleteTagBackend()
  return (
    <DropdownMenu>
      <DropdownTrigger className='btn btn-circle btn-ghost'>
        <TagIcon className='w-8 h-8' />
      </DropdownTrigger>
      <DropdownContent align='end'>
        <>
          {list.map((tag: MediaTagWithClimb) => (
            <DropdownPrimitive.DropdownMenuItem key={`${tag.mediaUuid}-${tag.climb.id}`} className='px-2 py-3'>
              <Tag
                tag={tag}
                isAuthorized={isAuthorized}
                onDelete={onDelete}
                showDelete
                size='lg'
              />
            </DropdownPrimitive.DropdownMenuItem>
          ))}
        </>
        <DropdownSeparator />
        <AddTag
          imageInfo={imageInfo}
          label={<div className='badge badge-lg gap-2'><PlusIcon className='w-4 h-4 inline-block' /> New tag</div>}
        />
        <DropdownSeparator />
        <DropdownPrimitive.DropdownMenuItem className='px-2.5 py-3'>Cancel</DropdownPrimitive.DropdownMenuItem>
      </DropdownContent>
    </DropdownMenu>
  )
}

interface TagListProps {
  list: MediaTagWithClimb[]
  // onDelete: (mediaUuid: string, destinationId: string) => void
  isAuthorized?: boolean
  children?: JSX.Element
  imageInfo: MediaType
}
