import React from 'react'
import Link from 'next/link'
import { getSlug } from '../js/utils'

interface StateType {
  areaName: string
  slug: string
}

function USToC ({ areas }): JSX.Element {
  return (
    <section>
      <h2 className='text-xl font-bold mt-6'>Explore by State</h2>
      <div className='flex space-x-4'>
        {areas.map((area) => {
          const { area_name: areaName, metadata } = area
          return (
            <div key={metadata.area_id}>
              <State areaName={areaName} slug={getSlug(metadata.area_id, metadata.leaf)} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

function State ({ areaName, slug }: StateType): JSX.Element {
  return (
    <Link href={slug} passHref>
      <a>{areaName}</a>
    </Link>
  )
}

export default USToC
