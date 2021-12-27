import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'
import USToc from '../components/USToC'
import RandomRouteCard from '../components/RandomRouteCard'

function getRandomInt (min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min) + min)
}

function IndexPage (): JSX.Element {
  let allClimbingRoutes = useStaticQuery(graphql`
    query {
      allClimb {
        edges {
          node {
            slug
            pathTokens
            frontmatter {
              route_name
              yds
              type {
                tr
                trad
                sport
                boulder
              }
              metadata {
                climb_id
              }
            }
          }
        }
      }
    }
  `)

  const min = 0
  const max: number = allClimbingRoutes.allClimb.edges.length
  const randomIndex = getRandomInt(min, max)
  let randomClimb = null
  if (allClimbingRoutes.allClimb.edges.length > 0) {
    randomClimb = allClimbingRoutes.allClimb.edges[randomIndex].node
  }
  allClimbingRoutes = []
  return (
    <Layout>
      {/* eslint-disable react/jsx-pascal-case */}
      <SEO
        keywords={['openbeta', 'rock climbing', 'climbing api']}
        description='Climbing route catalog'
        title='Home'
      />

      <USToc />

      <h2 className='text-xl font-bold mt-8'>
        Randomly Featured Route
      </h2>
      <div className='flex'>
        <div className='w-2/6'>
          <RandomRouteCard climb={randomClimb} />
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage
