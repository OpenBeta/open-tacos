import { useCallback } from 'react'
import classNames from 'classnames'
import { useMutation } from '@apollo/client'

import { MUTATION_REMOVE_MEDIA_TAG } from '../../js/graphql/fragments'
import { graphqlClient } from '../../js/graphql/Client'
import { MediaTagWithClimb } from '../../js/types'
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
