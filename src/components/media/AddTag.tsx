import { memo } from 'react'
import { useMutation } from '@apollo/client'

import { graphqlClient } from '../../js/graphql/Client'
import { MUTATION_ADD_CLIMB_TAG_TO_MEDIA } from '../../js/graphql/fragments'
import ClimbSearchForTagging from '../search/ClimbSearchForTagging'
import { MediaType } from '../../js/types'

interface ImageTaggerProps {
  imageInfo: MediaType
  onTagAdded: (data: any) => void
  className?: string
}

export default function AddTag ({ imageInfo, onTagAdded, className = '' }: ImageTaggerProps): JSX.Element | null {
  const [tagPhotoWithClimb] = useMutation(
    MUTATION_ADD_CLIMB_TAG_TO_MEDIA, {
      client: graphqlClient,
      errorPolicy: 'none',
      onCompleted: onTagAdded
    }
  )

  return (
    <ClimbSuggestion
      className={className}
      isMobile={false}
      placeholder='Search for climb'
      onSelect={async (item) => {
        const { climbUUID } = item
        try {
          await tagPhotoWithClimb({
            variables: {
              mediaUuid: imageInfo.mediaId,
              mediaUrl: imageInfo.filename,
              srcUuid: climbUUID
            }
          })
        } catch (e) {
          // TODO: Add friendly error message
          console.log('tagging API error', e)
        }
        close()
      }}
    />
  )
}

const ClimbSuggestion = memo(ClimbSearchForTagging)
