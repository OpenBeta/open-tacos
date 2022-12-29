import React from 'react'
import { AreaMetadataType, CountByGroupType } from '../../js/types'
import Description from '../ui/Description'
// import FavouriteButton from '../users/FavouriteButton'

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
          {props.latitude.toFixed(5)}, {props.longitude.toFixed(5)}
        </div>
      </a>

      {/* <div className='flex-1 flex justify-end'>
        // vnguyen: temporarily removed until we have view favorites feature
        <FavouriteButton areaId={props.areaMeta.areaId} />
      </div> */}

      <div className='mt-6'>
        <Description cont={props.description} maxLength={100} />
      </div>
    </div>
  )
}
