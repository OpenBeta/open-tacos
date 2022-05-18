import { useState, useEffect, useCallback, memo } from 'react'
import { usePopper } from 'react-popper'
import { useMutation } from '@apollo/client'

import { graphqlClient } from '../../js/graphql/Client'
import { MUTATION_ADD_CLIMB_TAG_TO_MEDIA } from '../../js/graphql/fragments'
import ClimbSearchForTagging from '../search/ClimbSearchForTagging'
import { MediaType } from '../../js/types'

interface ImageTaggerProps {
  isOpen: boolean
  mouseXY: number[]
  close: () => void
  imageInfo: MediaType
  onCompleted: (data: any) => void
}

export default function ImageTagger ({ isOpen, mouseXY, imageInfo, close, onCompleted }: ImageTaggerProps): JSX.Element {
  const [tagPhotoWithClimb] = useMutation(
    MUTATION_ADD_CLIMB_TAG_TO_MEDIA, {
      client: graphqlClient,
      errorPolicy: 'none',
      onCompleted
    }
  )

  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const { styles, attributes, update } = usePopper(referenceElement, popperElement, {
    modifiers: [{
      name: 'arrow',
      options: {
        padding: 15 // not working
      }
    }],
    strategy: 'fixed'
  })

  // Run once
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  })

  // Run always
  useEffect(() => {
    if (update != null) void update()
  }, [mouseXY])

  const onKeyDown = useCallback((event) => {
    if (isOpen && event.key === 'Escape') {
      console.log('Closing search')
      close()
    }
  }, [])

  const boxOffset = 16
  if (!isOpen) return null
  return (
    <div className='fixed top-0 left-0 select-none' onBlur={close}>
      <div
        className='relative w-8 h-8 ring-1 ring-neutral-300 rounded border border-white'
        style={{
          left: mouseXY[0] - boxOffset,
          top: mouseXY[1] - boxOffset
        }} ref={setReferenceElement}
      />
      <div
        tabIndex={0}
        ref={setPopperElement} style={{ ...styles.popper }} {...attributes.popper}
      >
        <ClimbSuggestion
          isMobile={false} placeholder='Search for climb' onSelect={async (item) => {
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
      </div>
    </div>
  )
}

const ClimbSuggestion = memo(ClimbSearchForTagging)
