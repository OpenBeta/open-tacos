import { PlusIcon } from '@heroicons/react/24/outline'

import ClimbSearchForTagging from '../search/ClimbSearchForTagging'
import { EntityType, MediaType, TagTargetType, TypesenseAreaType, TypesenseDocumentType } from '../../js/types'
import usePhotoTag from '../../js/hooks/usePhotoTag'

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
  const { tagPhotoCmd } = usePhotoTag()
  return (
    <ClimbSearchForTagging
      onCancel={onCancel}
      label={label}
      openSearch={openSearch}
      onSelect={async (props) => {
        try {
          const linkedEntityId = props.type === EntityType.climb
            ? (props as TypesenseDocumentType).climbUUID
            : (props as TypesenseAreaType).id

          await tagPhotoCmd({
            mediaUuid: imageInfo.mediaId,
            mediaUrl: imageInfo.filename,
            destinationId: linkedEntityId,
            destType: props.type === EntityType.climb ? TagTargetType.climb : TagTargetType.area
          })
        } catch (e) {
          // TODO: Add friendly error message
          console.log('tagging API error', e)
        }
      }}
    />
  )
}

export const DesktopLabel = (): JSX.Element =>
  <button className='badge gap-2 text-sm' aria-label='climb-search'>
    <PlusIcon className='w-6 h-6' /> Add new tag
  </button>
