import React from 'react'
import Link from 'next/link'

interface StateType {
  areaName: string
  slug: string
}

function USToC (): JSX.Element {
  const states = []

  return (
    <section>
      <h2 className='text-xl font-bold mt-6'>Explore by State</h2>
      <div className='flex space-x-4'>
        {states.map(({ node }) => {
          const { frontmatter, slug } = node
          return (
            <div key={slug}>
              <State areaName={frontmatter.area_name} slug={slug} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

function State ({ areaName, slug }: StateType): JSX.Element {
  return <Link href={slug}>{areaName}</Link>
}

export default USToC
