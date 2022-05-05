import { useState, useEffect, useCallback, memo } from 'react'
import { usePopper } from 'react-popper'
import { useMutation } from '@apollo/client'
import { v5 as uuidv5 } from 'uuid'

import { graphqlClient } from '../../js/graphql/Client'
import { TAG_CLIMB } from '../../js/graphql/fragments'
import ClimbSearchForTagging from '../search/ClimbSearchForTagging'

interface ImageTaggerProps {
  isOpen: boolean
  mouseXY: number[]
  close: () => void
  imageInfo: any
  onClick: any
  onCompleted: (data: any) => void
}

export default function ImageTagger ({ isOpen, mouseXY, imageInfo, close, onCompleted }: ImageTaggerProps): JSX.Element {
  const [tagPhotoWithClimb] = useMutation(
    TAG_CLIMB, {
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
            const mediaUuid = uuidv5(imageInfo.origin_path, uuidv5.URL)
            try {
              await tagPhotoWithClimb({
                variables: {
                  mediaUuid,
                  mediaUrl: imageInfo.origin_path,
                  srcUuid: climbUUID
                }
              })
              // Todo: update Apollo cache
            } catch (e) {
              console.log(e)
            }
            close()
          }}
        />
      </div>
    </div>
  )
}

const ClimbSuggestion = memo(ClimbSearchForTagging)
