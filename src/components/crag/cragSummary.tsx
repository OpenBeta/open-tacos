import React, { useMemo, useRef, useState } from 'react'
import { AreaMetadataType, CountByGroupType } from '../../js/types'
import FavouriteButton from '../users/FavouriteButton'

export interface CragHeroProps {
  title: string
  latitude: number
  longitude: number
  description: string
  galleryRef?: string
  aggregate: CountByGroupType[]
  media: any[]
  areaMeta: AreaMetadataType
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

/**
 * Please note that this is an entirely untested function. There is absolutely
 * no guarentee of url-encode safety or link integrity.
 *
 * It seems to work, but this is not an API call or anything... just
 * a query lookup
 */
function getMapHref (lat: number, lng: number): string {
  return `https://www.google.com/maps/search/${lng},+${lat}`
}

function Description ({ cont }: {cont: string}): JSX.Element {
  const maxLength = 100 // words
  const [showFull, setShow] = useState(false)
  const [content, overflowText] = useMemo(() => summarize(cont, maxLength), [cont])
  const overflow = overflowText.length > 0
  const descRef = useRef<HTMLParagraphElement>(null)

  if (overflow) {
    const overflowHeight = descRef.current !== null ? descRef.current?.clientHeight : 500
    return (
      <div className='transition'>
        <p>
          {content}
          {' '}
          <button
            onClick={() => setShow(!showFull)}
            className={`text-blue-600 underline transition
            ${showFull ? 'opacity-0' : 'opacity-1'}`}
          >
            See full description
          </button>
        </p>

        <div
          className='overflow-y-hidden'
          style={{
            transition: 'max-height 0.2s ease-in-out',
            maxHeight: !showFull ? '0px' : `${overflowHeight}px`
          }}
        >
          <p ref={descRef}>
            {overflowText}
            {' '}
            <button
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
      {content !== '' ? content : 'This crag has no description'}
    </div>
  )
}

/**
 * Responsive summary of major attributes for a crag / boulder.
 * This could actually be extended to giving area summaries as well.
 */
export default function CragSummary (props: CragHeroProps): JSX.Element {
  return (
    <div className=''>
      <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold max-w-sm'>
        {props.title}
      </h1>

      <a
        href={getMapHref(props.latitude, props.longitude)}
        target='blank'
      >
        <div
          className='text-slate-700 tracking-wider hover:underline
          hover:text-blue-700 cursor-pointer text-sm'
          title='Click to view on google maps'
        >
          {props.latitude}, {props.longitude}
        </div>
      </a>

      <div className='flex-1 flex justify-end'>
        <FavouriteButton areaId={props.areaMeta.areaId} />
      </div>

      <div className='mt-6'>
        <Description cont={props.description} />
      </div>
    </div>
  )
}
