import React from 'react'
import Link from 'next/link'
import { shuffle } from 'underscore'

import { AggregateType, AreaType, CountByDisciplineType, DisciplineStatsType } from '../../../js/types'
import { sanitizeName } from '../../../js/utils'
import { FeatureImage } from './FeatureImage'
import { CLIENT_CONFIG } from '../../../js/configs/clientConfig'

function FeatureCard ({ area }: { area: AreaType }): JSX.Element {
  const { areaName, pathTokens, aggregate, metadata, totalClimbs, media } = area

  if (media == null || media.length === 0) {
    return <></>
  }

  const imageUrl = `${CLIENT_CONFIG.CDN_BASE_URL}${shuffle(media)[0].mediaUrl}?h=300&q=90`

  const image = {
    url: imageUrl,
    license: 'All Rights Reserved',
    creator: '',
    license_url: '',
    attribution: ''
  }

  function formatClimbingTypes (aggregate: AggregateType): JSX.Element {
    const aggByDiscipline: CountByDisciplineType = aggregate.byDiscipline
    return (
      <>
        {Object.keys(aggregate.byDiscipline).map((key: string) => {
          // @ts-expect-error
          if ((aggByDiscipline?.[key] as DisciplineStatsType)?.total > 5) {
            return (
              <span key={key} className='rounded bg-gray-600 text-white px-2 py-0.5 mr-2 mb-2'>
                {key}
              </span>
            )
          }
          return null
        })}
      </>
    )
  }

  const attribution = image.attribution ?? image.creator ?? ''

  return (
    <div className='rounded-md overflow-hidden cursor-pointer hover:brightness-75 border border-gray-300'>
      <Link href={`/crag/${metadata.areaId}`} passHref className='m-4 lg:m-0'>
        <FeatureImage image={image} />
        <div className='mx-0 lg:mx-2 my-2.5'>
          <h3 className='whitespace-normal font-semibold text-base truncate'>{sanitizeName(areaName)}</h3>
          <div className='font-semibold text-xs text-secondary'>{totalClimbs} Climbs</div>
          <div className='my-1 text-xs flex gap-2 flex-wrap'>{formatClimbingTypes(aggregate)}</div>
          <div className='text-secondary text-xs text-tietiary'>{pathTokens.slice(1).join(' / ')}</div>
          {attribution !== '' && <div className='text-xs tertiary'>Image By: {attribution}</div>}
        </div>
      </Link>
    </div>
  )
}

export default FeatureCard
