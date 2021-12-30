import React from 'react'
import { graphql, useStaticQuery, Link } from 'gatsby'

interface StateType {
  areaName: string
  slug: string
}

function USToC (): JSX.Element {
  const states = useStaticQuery(graphql`
    query myquery {
      allOldArea(
        filter: { rawPath: {regex: "/^USA\/[a-zA-Z]+[^\/]$/" }}
        sort: { fields: frontmatter___area_name }
      ) {
        edges {
          node {
            frontmatter {
              area_name
            }
            slug
          }
        }
      }
    }
  `)

  return (
    <section>
      <h2 className='text-xl font-bold mt-6'>Explore by State</h2>
      <div className='flex space-x-4'>
        {states.allOldArea.edges.map(({ node }) => {
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
  return <Link to={slug}>{areaName}</Link>
}

export default USToC
