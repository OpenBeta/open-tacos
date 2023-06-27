import { PlusIcon } from '@heroicons/react/24/outline'

import ClimbSearchForTagging from '../search/ClimbSearchForTagging'
import { EntityType, MediaWithTags, TagTargetType, TypesenseAreaType, TypesenseDocumentType } from '../../js/types'
import { AddEntityTagProps } from '../../js/graphql/gql/tags'

interface ImageTaggerProps {
  mediaWithTags: MediaWithTags
  label?: JSX.Element
  openSearch?: boolean
  onCancel?: () => void
  onAdd: (props: AddEntityTagProps) => Promise<void>
}

/**
 * Allow users to tag an image, ie associate a climb with an image.  Tag data will be recorded in the backend.
 * @param label A button that opens the climb search
 * @param imageInfo image info object
 */
export default function AddTag ({ mediaWithTags, onCancel, onAdd, label, openSearch = false }: ImageTaggerProps): JSX.Element | null {
  return (
    <ClimbSearchForTagging
      onCancel={onCancel}
      label={label}
      openSearch={openSearch}
      onSelect={async (props) => {
        const linkedEntityId = props.type === EntityType.climb
          ? (props as TypesenseDocumentType).climbUUID
          : (props as TypesenseAreaType).id

        // const [newTag, updatedMediaObject] = await addEntityTagCmd({
        //   mediaId: mediaWithTags.id,
        //   entityId: linkedEntityId,
        //   entityType: props.type === EntityType.climb ? TagTargetType.climb : TagTargetType.area
        // })
        void onAdd({
          mediaId: mediaWithTags.id,
          entityId: linkedEntityId,
          entityType: props.type === EntityType.climb ? TagTargetType.climb : TagTargetType.area
        })
      }}
    />
  )
}

export const DesktopLabel = (): JSX.Element =>
  <button className='badge gap-2 text-sm' aria-label='climb-search'>
    <PlusIcon className='w-6 h-6' /> Add new tag
  </button>
