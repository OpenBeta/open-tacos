import { useCallback } from 'react'
import classNames from 'classnames'
import { useMutation } from '@apollo/client'

import { MUTATION_REMOVE_MEDIA_TAG } from '../../js/graphql/fragments'
import { graphqlClient } from '../../js/graphql/Client'
import { MediaTagWithClimb } from '../../js/types'
import Tag from './Tag'

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
            'text-xs flex flex-wrap justify-start space-x-2 space-y-0.5 bg-white',
            hovered ? 'bg-opacity-100' : 'bg-opacity-20',
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
