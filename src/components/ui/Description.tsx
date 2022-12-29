import React, { useMemo, useRef, useState } from 'react'
import { summarize } from '../crag/cragSummary'

interface Props { cont: string, maxLength: number }

/**
 * A description component with view more / view less behavior
 * * `cont`: content to display in paragraph
 * * `maxLength`: max number of words until truncated to nearest sentence
 */
function Description ({ cont, maxLength }: Props): JSX.Element {
  const [showFull, setShow] = useState(false)
  const [content, overflowText] = useMemo(() => summarize(cont, maxLength), [cont])
  const overflow = overflowText.length > 0
  const descRef = useRef<HTMLParagraphElement>(null)

  if (overflow) {
    const overflowHeight = descRef.current !== null ? descRef.current?.clientHeight : 500
    return (
      <div data-testid='description' className='transition'>
        <p>
          {content}&nbsp;
          <button
            data-testid='show-button'
            onClick={() => setShow(!showFull)}
            className={`text-blue-600 underline transition
              ${showFull ? 'opacity-0' : 'opacity-1'}`}
          >
            See full description
          </button>
        </p>

        <div
          data-testid='description-hidden-section'
          className='overflow-y-hidden'
          style={{
            transition: 'max-height 0.2s ease-in-out',
            maxHeight: !showFull ? '0px' : `${overflowHeight}px`
          }}
        >
          <p ref={descRef} aria-hidden={!showFull ? 'true' : 'false'}>
            {overflowText}&nbsp;
            <button
              data-testid='hide-button'
              onClick={() => setShow(!showFull)}
              className={`text-blue-600 underline transition
            ${showFull ? 'opacity-1' : 'opacity-0'}`}
            >
              Hide full description
            </button>
          </p>
        </div>

      </div>
    )
  }
  return (
    <div>
      {content !== '' ? content : 'No description found'}
    </div>
  )
}

export default Description
