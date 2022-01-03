import React from 'react'
import { useStaticQuery, graphql, navigate, Link } from 'gatsby'

function Climbs ({ id }) {
  const allClimbingRoutes = useStaticQuery(graphql`
    query {
      allClimb(sort: { fields: frontmatter___metadata___mp_id }) {
        edges {
          node {
            slug
            frontmatter {
              metadata {
                mp_id
              }
            }
          }
        }
      }
    }
  `)

  const list = allClimbingRoutes.allClimb.edges

  const foundNode = list.find(
    ({ node }) => id === node.frontmatter.metadata.mp_id
  )

  if (foundNode) {
    const { node } = foundNode
    navigate(node.slug)
  }

  return (
    <div className='mt-12'>
      Climb not found.{' '}
      <Link className='btn btn-text' to='/'>
        Continue
      </Link>
    </div>
  )
}

export default Climbs
