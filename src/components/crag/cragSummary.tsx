import React, { useMemo } from 'react'

export interface CragHeroProps {
  title: string
  latitude: number
  longitude: number
  description: string
  galleryRef?: string
}

/**  For a given number of allowed words, quantize to the nearest
 * sentence termination in either direction.
 */
function summarize (s: string, n: number): string {
  // traverse in either direction.
  const words = s.split(' ')
  const quantized: string[] = []

  function distanceToTermination (ordinal: number): [number, number] {
    function distDir (direction: -1 | 1): number {
      let dist = 0
      for (let i = ordinal; i < words.length && i >= 0; i += direction) {
        if (words[i].endsWith('.')) {
          return dist
        }

        dist++
      }
    }
    return [distDir(1), distDir(-1)]
  }

  for (const word of words) {
    if (quantized.length >= n) {
      // Check the distance to next sentence termination. (in both directions)
      const [dforward, dbackward] = distanceToTermination(quantized.length - 1)

      // If it is nearer to remove elements until no sentence is interrupted,
      // then pop elements until we hit a sentence termination.
      if (dbackward < dforward) {
        while (!quantized[quantized.length - 1].endsWith('.')) {
          quantized.pop()
        }
      } else {
        while (!quantized[quantized.length - 1].endsWith('.')) {
          quantized.push(words[quantized.length - 1])
        }
      }

      break
    }

    quantized.push(word)
  }

  return quantized.join(' ')
}

const MissingCragMessage = (): JSX.Element => (
  <span>
    There's no description for this entity.
    <a className='ml-2 text-blue-500 underline cursor-pointer'>Add one</a>
  </span>
)

/** Responsive summary of major attributes for a crag / boulder.
 * This could actually be extended to giving area summaries as well.
 */
export default function CragSummary (props: CragHeroProps): JSX.Element {
  const maxWordsInSummary = 50

  // This will truncate longer descriptions so that users aren't assaulted with a
  // massive block of text. In the sprit of progressive disclosure I'd say there
  // should be a button somewhere below to view the full version. This is more of
  // a "Summary"
  let content: String | JSX.Element =
  useMemo(() => summarize(props.description, maxWordsInSummary), [props.description])

  if (content === '' || content === null) {
    content = <MissingCragMessage />
  }

  return (
    <div className='md:flex w-full'>
      <div>
        <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold max-w-sm'>
          {props.title}
        </h1>
        <div className='text-slate-700 tracking-wider'>
          {props.latitude}, {props.longitude}
        </div>
      </div>

      <div className='border-slate-500 border-l-2 mx-6 md:mx-8 lg:mx-16' />

      <div className='max-w-4xl flex-1 mt-2'>
        <h3 className='font-semibold tracking-tight'>Description</h3>
        <div className='my-2'>
          {content}
        </div>
      </div>
    </div>
  )
}
