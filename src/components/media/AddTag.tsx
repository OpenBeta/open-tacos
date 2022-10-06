import { useMutation } from '@apollo/client'

import { graphqlClient } from '../../js/graphql/Client'
import { MUTATION_ADD_CLIMB_TAG_TO_MEDIA } from '../../js/graphql/fragments'
import ClimbSearchForTagging from '../search/ClimbSearchForTagging'
import { MediaType } from '../../js/types'
import { actions } from '../../js/stores'

interface ImageTaggerProps {
  imageInfo: MediaType
  onTagAdded?: (data: any) => void
  label?: JSX.Element
}

/**
 * Allow users to tag an image, ie associate a climb with an image.  Tag data will be recorded in the backend.
 * @param label A button that opens the climb search
 * @param imageInfo image info object
 * @param onTagAdded an optional callback invoked after a tag added to the backend
 */
export default function AddTag ({ imageInfo, onTagAdded, label }: ImageTaggerProps): JSX.Element | null {
  const addTagToLocalStore = async (data: any): Promise<void> => await actions.media.addTag(data)

  const [tagPhotoWithClimb] = useMutation(
    MUTATION_ADD_CLIMB_TAG_TO_MEDIA, {
      client: graphqlClient,
      errorPolicy: 'none',
      onCompleted: addTagToLocalStore
    }
  )

  return (
    <ClimbSearchForTagging
      label={label}
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
