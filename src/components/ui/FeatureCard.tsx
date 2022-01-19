import React, { useEffect } from 'react'
import Link from 'next/link'
import { AreaType } from '../../js/types'
import { getSlug } from '../../js/utils'

interface OpenverseImage {
  creator: string
  url: string
  attribution: string
}

const RESULT_LIMIT = 10
const LICENSES = 'CC0,BY-NC-SA,BY-SA,BY-NC-SA'
function FeatureCard ({ area }: { area: AreaType }): JSX.Element {
  const { area_name: areaName, pathTokens, aggregate, metadata, totalClimbs } = area
  const [image, setImage] = React.useState<string>('')
  const [attribution, setAttribution] = React.useState<string>('')

  useEffect(() => {
    const query = `rock+climb+${areaName.replace(' ', '+')}`

    const url = `https://api.openverse.engineering/v1/images/?license=${LICENSES}&page_size=${RESULT_LIMIT}&page=1&q=${query}`

    fetch(url).then(async r => await r.json()).then((data) => {
      if (data?.result_count > 0) {
        const image: OpenverseImage = data.results[Math.floor(Math.random() * Math.min(RESULT_LIMIT, data?.result_count))]
        setImage(image.url)
        setAttribution(`Creator: ${image.creator}, ${image.attribution}`)
      } else throw new Error('no image available')
    }).catch(err => {
      setImage('/public/tortilla.png')
      console.warn(err)
    })
  }, [])

  const climbTypes = [...aggregate.byType]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .reduce((acc, t) => {
      t.count > 5 && acc.push(t.label)
      return acc
    }, [])
    .join(', ')

  return (
    <div
      className='card rounded-lg cursor-pointer hover:bg-yellow-50 border'
    >
      <Link href={getSlug(metadata.area_id, metadata.leaf)} passHref>
        <div className='m-5'>
          <div style={{ height: '250px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url('${image}')` }} className='overflow-hidden'>
            <img className='object-cover' alt={attribution} />
          </div>
          <h3
            className='font-medium font-sans my-2 text-base truncate'
          >
            <div className='text-lg'>{areaName}</div>
            <div>{totalClimbs} Climbs</div>
            <div className='text-sm'>{pathTokens.join(' / ')}</div>
            <div className='text-xs'>{climbTypes}</div>
          </h3>

          <div className='mt-4 flex justify-between items-center' />
        </div>
      </Link>
    </div>
  )
}

export default FeatureCard
