import { useState, MouseEventHandler } from 'react'
import classNames from 'classnames'
import { TagIcon, PlusIcon } from '@heroicons/react/24/outline'
import { DropdownMenuItem as PrimitiveDropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { signIn, useSession } from 'next-auth/react'

import AddTag from './AddTag'
import { DropdownMenu, DropdownContent, DropdownTrigger, DropdownItem, DropdownSeparator } from '../ui/DropdownMenu'
import { EntityTag, MediaWithTags } from '../../js/types'
import useMediaCmd, { RemoveEntityTagProps } from '../../js/hooks/useMediaCmd'
import { AddEntityTagProps } from '../../js/graphql/gql/tags'
import { LocationTag, UsernameTag } from './Tag'

export type OnAddCallback = (args: AddEntityTagProps) => Promise<void>

export type OnDeleteCallback = (args: RemoveEntityTagProps) => Promise<void>

interface TagsProps {
  mediaWithTags: MediaWithTags
  isAuthorized?: boolean
  isAuthenticated?: boolean
  showDelete?: boolean
  showActions?: boolean
  className?: string
  showUsernameTag?: boolean
}

/**
 * A horizontal tag list.  The last item is a CTA.
 */
export default function TagList ({ mediaWithTags, isAuthorized = false, isAuthenticated = false, showDelete = false, showActions = true, className = '', showUsernameTag = false }: TagsProps): JSX.Element | null {
  const { addEntityTagCmd, removeEntityTagCmd } = useMediaCmd()
  const session = useSession()

  if (mediaWithTags == null) {
    return null
  }

  const onAddHandler: OnAddCallback = async (args) => {
    await addEntityTagCmd(args, session.data?.accessToken)
  }

  const onDeleteHandler: OnDeleteCallback = async (args) => {
    await removeEntityTagCmd(args, session.data?.accessToken)
  }

  const { entityTags, id, username } = mediaWithTags

  return (
    <div className={
          classNames(
            'text-xs inline-flex flex-wrap justify-start items-center gap-2 overflow-hidden',
            className
          )
          }
    >
      {showUsernameTag &&
        username !== undefined &&
          <UsernameTag username={username} />}
      {entityTags.map((tag: EntityTag) =>
        <LocationTag
          key={`${tag.targetId}`}
          mediaId={id}
          tag={tag}
          onDelete={onDeleteHandler}
          isAuthorized={isAuthorized}
          showDelete={showDelete}
        />)}
      {showActions && isAuthorized &&
        <AddTag
          mediaWithTags={mediaWithTags}
          label={<AddTagBadge />}
          onAdd={onAddHandler}
        />}
      {showActions && !isAuthenticated &&
        <AddTagBadge onClick={() => { void signIn('auth0') }} />}
    </div>
  )
}

export interface TagListProps {
  mediaWithTags: MediaWithTags
  isAuthorized?: boolean
  children?: JSX.Element
}

/**
 * Mobile tag list wrapped in a popup menu
 */
export const MobilePopupTagList: React.FC<TagListProps> = ({ mediaWithTags, isAuthorized = false }) => {
  const session = useSession()
  const { addEntityTagCmd, removeEntityTagCmd } = useMediaCmd()
  const [openSearch, setOpenSearch] = useState(false)

  const onAddHandler: OnAddCallback = async (args) => {
    await addEntityTagCmd(args, session.data?.accessToken)
  }

  const onDeleteHandler: OnDeleteCallback = async (args) => {
    await removeEntityTagCmd(args, session.data?.accessToken)
  }
  const { id, entityTags, username } = mediaWithTags
  return (
    <div aria-label='tag popup'>
      <DropdownMenu>
        <DropdownTrigger className='btn btn-circle btn-ghost' aria-label='tag menu'>
          <TagIcon className='w-8 h-8' />
        </DropdownTrigger>
        <DropdownContent align='end'>
          <>
            {username !== undefined && <UsernameTag username={username} size='lg' />}
            {entityTags.map(tag => (
              <PrimitiveDropdownMenuItem key={`${tag.id}`} className='px-2 py-3'>
                <LocationTag
                  mediaId={id}
                  tag={tag}
                  isAuthorized={isAuthorized}
                  onDelete={onDeleteHandler}
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
        onAdd={onAddHandler}
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
