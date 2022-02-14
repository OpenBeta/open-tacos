import React, { useEffect } from 'react'
import Link from 'next/link'
import { AreaType } from '../../../js/types'
import { getSlug, sanitizeName } from '../../../js/utils'
import { OpenverseImage, OpenverseResponse } from '.'
import { FeatureImage, DefaultImage } from './FeatureImage'
import axios from 'axios'

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
  const [sanitizedName] = React.useState(sanitizeName(areaName))

  const mainQuery = ['rock', 'climbing', ...sanitizedName.split(' ')]
  const backupQuery = ['rock', ...sanitizedName.split(' ')]

  useEffect(() => {
    void fetchImages()
  }, [])

  const fetchImages = async (): Promise<void> => {
    let images = await findImages(mainQuery)
    if (images === null) {
      images = await findImages(backupQuery)
    }
    if (images !== null) {
      pickOneFrom(images)
    }
  }

  const pickOneFrom = (images: OpenverseImage[]): void => {
    if (images.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(RESULT_LIMIT, images.length))
      const image: OpenverseImage = images[randomIndex]
      setImage(image)
    }
  }

  function formatClimbingTypes (): string {
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
            <div className='text-xs'>{formatClimbingTypes()}</div>
            {attribution !== '' && <div className='text-xs'>Image By: {attribution}</div>}
          </h3>

          <div className='mt-4 flex justify-between items-center' />
        </div>
      </Link>
    </div>
  )
}

export default FeatureCard

const findImages = async (query: string[]): Promise<OpenverseImage[]> => {
  const queryString = query.join('+')
  const source = 'wordpress,wikimedia,smithsonian_libraries,flickr'
  const url = `https://api.openverse.engineering/v1/images/?source=${source}&license=${LICENSES}&page_size=${RESULT_LIMIT}&page=1&q=${queryString}`

  try {
    const response = await axios.get<OpenverseResponse>(url)
    if (response.status === 200) {
      return response.data.results
    }
  } catch (e) {
    console.warn(e)
  }
  return [DEFAULT_IMAGE]
}
