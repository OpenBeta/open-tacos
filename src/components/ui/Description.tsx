import React, { useMemo, useRef, useState } from 'react'

interface Props { cont: string, maxLength: number }

/**
 * A description component with view more / view less behavior
 * * `cont`: content to display in paragraph
 * * `maxLength`: max number of words until truncated to nearest sentence
 */
export default function Description ({ cont, maxLength }: Props): JSX.Element {
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

/**  For a given number of allowed words, quantize to the nearest
 * sentence termination in either direction.
 */
export function summarize (s: string, n: number): [string, string] {
  // traverse in either direction.
  const words = s.split(' ')
  const quantized: string[] = []

  if (words.length <= n || words.length === 0) {
    return [s, '']
  }

  function distanceToTermination (ordinal: number): [number, number] {
    function distDir (direction: -1 | 1): number {
      let dist = 0
      for (let i = ordinal; i < words.length && i >= 0; i += direction) {
        if (words[i].endsWith('.')) {
          return dist
        }

        dist++
      }

      return dist
    }
    return [distDir(1), distDir(-1)]
  }

  if (!s.includes('.')) {
    return [words.slice(0, n).join(' '), '']
  }

  for (const word of words) {
    if (quantized.length >= n) {
      // Check the distance to next sentence termination. (in both directions)
      const [dforward, dbackward] = distanceToTermination(quantized.length - 1)

      // If it is nearer to remove elements until no sentence is interrupted,
      // then pop elements until we hit a sentence termination.
      if (dbackward < dforward && quantized.length > 1) {
        while (quantized.length > 0 && !quantized[quantized.length - 1].endsWith('.')) {
          quantized.pop()
        }
      } else {
        while (quantized[quantized.length - 1] !== undefined && !quantized[quantized.length - 1].endsWith('.')) {
          quantized.push(words[quantized.length - 1])
        }
      }

      break
    }

    quantized.push(word)
  }

  return [quantized.join(' '), words.slice(quantized.length).join(' ')]
}
