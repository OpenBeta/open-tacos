import * as React from 'react'
import { useMemo } from 'react'
import { summarize } from '../../crag/cragSummary'

export interface PanelHeaderProps{
  title: string
  latitude: number
  longitude: number
  description: string
  galleryRef?: string
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

export function PanelHeader (props: PanelHeaderProps): JSX.Element {
  const maxWordsInSummary = 50

  // This will truncate longer descriptions so that users aren't assaulted with a
  // massive block of text. In the sprit of progressive disclosure I'd say there
  // should be a button somewhere below to view the full version. This is more of
  // a "Summary"
  let [content] =
  useMemo(() => summarize(props.description, maxWordsInSummary), [props.description])

  if (content === '' || content === null) {
    content = ''
  }

  return (
    <div className='w-full'>
      <div>
        <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold max-w-sm'>
          {props.title}
        </h1>
        <a
          href={getMapHref(props.latitude, props.longitude)}
          target='blank'
        >
          <div
            className='text-slate-700 tracking-wider hover:underline hover:text-blue-700
            text-sm'
            title='Click to view on google maps'
          >
            {props.latitude.toFixed(5)}, {props.longitude.toFixed(5)}
          </div>
        </a>
      </div>

      <div className='border-slate-500 border-l-2 mx-6 md:mx-8 lg:mx-16' />

      {
      // We only show description if such data is available. In the future it will make
      // sense to allow users to add or edit these descriptions if they feel the need to.
      content !== ''
        ? (
          <div className='mt-2'>
            <h3 className='font-semibold tracking-tight'>Description</h3>
            <div className='my-2 whitespace-pre-line'>
              {content}
            </div>
          </div>
          )
        : ''
}

    </div>
  )
}
