import React from 'react'
import Link from 'next/link'

interface StateType {
  areaName: string
  slug: string
}

function USToC({ areas }): JSX.Element {

  return (
    <section>
      <h2 className='text-xl font-bold mt-6'>Explore by State</h2>
      <div className='flex space-x-4'>
        {areas.map((area) => {
          const { area_name: areaName, metadata } = area
          return (
            <div key={metadata.area_id}>
              <State areaName={areaName} slug={metadata.area_id} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

function State({ areaName, slug }: StateType): JSX.Element {
  return <Link href={slug}><a>{areaName}</a></Link>
}

export default USToC
