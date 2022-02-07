import React, { useEffect } from 'react'
import Link from 'next/link'
import { AggregateType, AreaType } from '../../../js/types'
import { getSlug, sanitizeName } from '../../../js/utils'
import { OpenverseImage } from '.'
import { FeatureImage, DefaultImage } from './FeatureImage'

const DEFAULT_IMAGE = {
  url: '/tortilla.png',
  license: '',
  creator: '',
  license_url: '',
  attribution: ''
}

const RESULT_LIMIT = 10

const LICENSES = 'CC0,BY,BY-NC-SA,BY-SA,BY-NC-ND'

function FeatureCard ({ area }: { area: AreaType }): JSX.Element {
  const { id, area_name: areaName, pathTokens, aggregate, metadata, totalClimbs } = area
  const [image, setImage] = React.useState<OpenverseImage>(DEFAULT_IMAGE)

  useEffect(() => {
    const main = ['rock', 'climbing', ...areaName.split(' ')]
    const backup = ['rock', 'mountain', ...areaName.split(' ')]
    findImage({ queries: [main, backup] }).catch((err) => {
      console.warn('could not find image for :', areaName, err)
    })
  }, [])

  async function findImage ({ queries }: { queries: string[][]}): Promise<void> {
    const queryString = queries[0].join('+')
    const backups = queries.slice(1)
    const source = 'wordpress,wikimedia,smithsonian_libraries,flickr'
    const url = `https://api.openverse.engineering/v1/images/?source=${source}&license=${LICENSES}&page_size=${RESULT_LIMIT}&page=1&q=${queryString}`

    return await fetch(url)
      .then(async r => await r.json())
      .then(processImage)
      .catch(err => {
        if (backups.length > 0) {
          return findImage({ queries: backups })
        } else {
          setImage(DEFAULT_IMAGE)
        }
        console.warn(err)
      })
  }

  function processImage (data: any): void {
    if (data?.result_count > 0) {
      const randomImage = Math.floor(Math.random() * Math.min(RESULT_LIMIT, data?.result_count))
      const image: OpenverseImage = data.results[randomImage]
      setImage(image)
    } else throw new Error('no image available')
  }

  function formatClimbingTypes (aggregateTypes: AggregateType): string {
    return [...aggregate.byType]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .reduce((acc, t) => {
        t.count > 5 && acc.push(t.label)
        return acc
      }, [])
      .join(', ')
  }

  const attribution = image.attribution ?? image.creator ?? ''

  return (
    <div
      className='card rounded-lg cursor-pointer hover:bg-ob-tertiary hover:bg-opacity-20 border'
    >
      <Link href={getSlug(id, metadata.leaf)} passHref>
        <div className='m-5'>
          {image !== DEFAULT_IMAGE && <FeatureImage image={image} />}
          {image === DEFAULT_IMAGE && <DefaultImage />}

          <h3
            className='font-medium whitespace-normal font-sans my-2 text-base truncate'
          >
            <div className='text-lg'>{sanitizeName(areaName)}</div>
            <div>{totalClimbs} Climbs</div>
            <div className='text-sm'>{pathTokens.join(' / ')}</div>
            <div className='text-xs'>{formatClimbingTypes(aggregate)}</div>
            {attribution !== '' && <div className='text-xs'>Image By: {attribution}</div>}
          </h3>

          <div className='mt-4 flex justify-between items-center' />
        </div>
      </Link>
    </div>
  )
}

export default FeatureCard
