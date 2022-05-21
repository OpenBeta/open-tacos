import { useCallback } from 'react'
import classNames from 'classnames'
import { XCircleIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useMutation } from '@apollo/client'

import { MUTATION_REMOVE_MEDIA_TAG } from '../../js/graphql/fragments'
import { graphqlClient } from '../../js/graphql/Client'
import { MediaTag, MediaClimbTag } from '../../js/types'
interface TagsProps {
  hovered: boolean
  list: MediaTag[]
  onDeleted: (props?: any) => void
}

export default function TagList ({ hovered, list, onDeleted }: TagsProps): JSX.Element {
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
            'text-xs px-1.5 py-1 flex flex-wrap justify-start space-x-2 space-y-0.5 bg-neutral-50 bg-opacity-20',
            hovered ? 'bg-opacity-40' : '')
          }
    >
      {list.map((tag: MediaClimbTag) =>
        <Tag
          key={`${tag.mediaUuid}-${tag.climb.id}`}
          highlighted={hovered}
          tag={tag}
          onDelete={onDeleteHandler}
        />)}
    </div>
  )
}

interface PhotoTagProps {
  highlighted: boolean
  tag: MediaClimbTag // handle both climb and area type
  onDelete: (mediaId: string, destinationId: string) => void
}

export const Tag = ({ tag, highlighted, onDelete }: PhotoTagProps): JSX.Element => {
  const { climb } = tag
  return (
    <span className={classNames(
      'border-neutral-400 bg-neutral-200 border rounded-xl max-w-[10rem] inline-flex items-center',
      highlighted ? 'bg-opacity-100' : 'bg-opacity-30'
    )}
    >
      <Link href={`/climbs/${climb.id}`} passHref>
        <a className='whitespace-nowrap truncate px-1 hover:underline'>{climb.name}</a>
      </Link>
      <span onClick={(e) => {
        onDelete(tag.mediaUuid, tag.climb.id)
        e.stopPropagation()
      }}
      >
        <XCircleIcon className='w-5 h-5' />
      </span>
    </span>
  )
}
