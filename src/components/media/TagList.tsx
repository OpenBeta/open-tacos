import { useCallback } from 'react'
import classNames from 'classnames'
import { XIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useMutation } from '@apollo/client'

import { MUTATION_REMOVE_MEDIA_TAG } from '../../js/graphql/fragments'
import { graphqlClient } from '../../js/graphql/Client'
import { MediaTagWithClimb } from '../../js/types'

interface TagsProps {
  hovered: boolean
  list: MediaTagWithClimb[]
  onDeleted: (props?: any) => void
  isAuthorized?: boolean
  className?: string
}

export default function TagList ({ hovered, list, onDeleted, isAuthorized = false, className = '' }: TagsProps): JSX.Element {
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
            'text-xs flex flex-wrap justify-start space-x-2 space-y-0.5 bg-neutral-50 bg-opacity-20',
            hovered ? 'bg-opacity-40' : '',
            className
          )
          }
    >
      {list.map((tag: MediaTagWithClimb) =>
        <Tag
          key={`${tag.mediaUuid}-${tag.climb.id}`}
          highlighted={hovered}
          tag={tag}
          onDelete={onDeleteHandler}
          isAuthorized={isAuthorized}
        />)}
    </div>
  )
}

interface PhotoTagProps {
  highlighted: boolean
  tag: MediaTagWithClimb // only handle climb tag for now
  onDelete: (mediaId: string, destinationId: string) => void
  isAuthorized?: boolean
}

export const Tag = ({ tag, highlighted, onDelete, isAuthorized = false }: PhotoTagProps): JSX.Element => {
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
        <span onClick={(e) => {
          onDelete(tag.mediaUuid, tag.climb.id)
          e.stopPropagation()
        }}
        >
          <XIcon className='cursor-pointer w-5 h-5 stroke-1 stroke-inherit hover:stroke-2' />
        </span>}
    </span>
  )
}
