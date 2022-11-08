import { useMutation } from '@apollo/client'
import { PlusIcon } from '@heroicons/react/24/outline'

import { graphqlClient } from '../../js/graphql/Client'
import { MUTATION_ADD_CLIMB_TAG_TO_MEDIA } from '../../js/graphql/gql/fragments'
import ClimbSearchForTagging from '../search/ClimbSearchForTagging'
import { MediaType } from '../../js/types'
import { actions } from '../../js/stores'

interface ImageTaggerProps {
  imageInfo: MediaType
  label?: JSX.Element
  openSearch?: boolean
  onCancel?: () => void
}

/**
 * Allow users to tag an image, ie associate a climb with an image.  Tag data will be recorded in the backend.
 * @param label A button that opens the climb search
 * @param imageInfo image info object
 */
export default function AddTag ({ imageInfo, onCancel, label, openSearch = false }: ImageTaggerProps): JSX.Element | null {
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
      onCancel={onCancel}
      label={label}
      openSearch={openSearch}
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

export const DesktopLabel = (): JSX.Element =>
  <button className='badge gap-2 text-sm' aria-label='climb-search'>
    <PlusIcon className='w-6 h-6' /> Add new tag
  </button>
