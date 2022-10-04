import { useState } from 'react'
import { useMutation } from '@apollo/client'

import { graphqlClient } from '../../js/graphql/Client'
import { MUTATION_ADD_CLIMB_TAG_TO_MEDIA } from '../../js/graphql/fragments'
import ClimbSearchForTagging from '../search/ClimbSearchForTagging'
import { MediaType } from '../../js/types'

interface ImageTaggerProps {
  id?: string
  imageInfo: MediaType
  onTagAdded?: (data: any) => void
  className?: string
  isCustomTrigger?: boolean
  placeholder?: string
}

export default function AddTag ({ id, isCustomTrigger = false, placeholder = 'Search for climb', imageInfo, onTagAdded, className = '' }: ImageTaggerProps): JSX.Element | null {
  const [tagPhotoWithClimb] = useMutation(
    MUTATION_ADD_CLIMB_TAG_TO_MEDIA, {
      client: graphqlClient,
      errorPolicy: 'none',
      onCompleted: onTagAdded
    }
  )

  return (
    <ClimbSearchForTagging
      className={className}
      isMobile
      isCustomTrigger={isCustomTrigger}
      placeholder={placeholder}
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

// const ClimbSuggestion = memo(ClimbSearchForTagging)

interface AddTagTriggerProps {
  id: string
  imageInfo: MediaType
  onTagAdded?: (data: any) => void
  className?: string
}

export const AddTagTrigger = ({ id, imageInfo, onTagAdded }: AddTagTriggerProps): JSX.Element => {
  const [open, setOpen] = useState(false)
  return (
    <div>
      {/* <button className='badge badge-outline' onClick={() => setOpen(true)}>+ Add tag </button> */}
      <AddTag id={id} imageInfo={imageInfo} isCustomTrigger placeholder='+ Add tag' />
    </div>
  )
}

// <button className='btn btn-sm gap-2'><PlusIcon className='w-5 h-5' /></button>
