import { useState } from 'react'
import { GetStaticProps } from 'next'
import { gql } from '@apollo/client'
import { graphqlClient } from '../../js/graphql/Client'
import Link from 'next/link'
import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import ButtonGroup from '../../components/ui/ButtonGroup'
import { Button } from '../../components/ui/Button'
import Icon from '../../components/Icon'
import BreadCrumbs from '../../components/ui/BreadCrumbs'
import { AreaType, Climb } from '../../js/types'
import { getScoreForGrade } from '../../js/utils'
import RouteCard from '../../components/ui/RouteCard'
import InlineEditor from '../../components/editor/InlineEditor'

interface CragProps {
  area: AreaType
}

interface CragSortType {
  value: string
  text: string
}

const Crag = ({ area }: CragProps): JSX.Element => {
  const { area_name: areaName, climbs, metadata, content, ancestors, pathTokens } = area

  const [selectedClimbSort, setSelectedClimbSort] = useState(0)
  const climbSortByOptions: CragSortType[] = [
    { value: 'leftToRight', text: 'Left To Right' },
    { value: 'grade', text: 'Grade' }
  ]

  return (
    <Layout layoutClz='layout-wide'>
      <SeoTags
        keywords={[areaName]}
        title={areaName}
        description='description'
      />

      <div className='overflow-y'>
        <div className='xl:flex xl:flex-row xl:gap-x-4 xl:justify-center xl:items-stretch'>
          <div className='xl:flex-none xl:max-w-screen-md xl:w-full'>
            <BreadCrumbs ancestors={ancestors} pathTokens={pathTokens} />
            <h1 className='title'>{areaName}</h1>
            <span className='flex items-center flex-shrink text-gray-500 text-xs gap-x-1'>
              <Icon type='droppin' />
              <a
                className='hover:underline hover:text-gray-800'
                href={`https://www.openstreetmap.org/#map=13/${metadata.lat}/${metadata.lng}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                {metadata.lat},{metadata.lng}
              </a>
            </span>
            <div
              className='pt-4 markdown'
            >
              <h2>Description</h2>
              <InlineEditor id='crag-1' markdown={content.description} readOnly />
            </div>
            <hr className='my-8' />
            <>
              <h2>Climbs</h2>
              <ButtonGroup
                disabled={false}
                selected={[selectedClimbSort]}
                onClick={(_, index) => {
                  setSelectedClimbSort(index)
                }}
                className='text-right'
              >
                {climbSortByOptions.map(({ text }, index) => {
                  return (
                    <Button
                      key={index}
                      label={text}
                      className={null}
                      onClick={null}
                    />
                  )
                })}
              </ButtonGroup>
              <div className='grid grid-cols-1 md:grid-cols-3 md:gap-x-3 gap-y-3'>
                {sortRoutes([...climbs], climbSortByOptions[selectedClimbSort]).map(
                  (climb: Climb) => {
                    const { yds, name, metadata, type } = climb
                    return (
                      <div className='pt-6 max-h-96' key={metadata.climb_id}>
                        <Link href={`/climbs/${metadata.climb_id}`} passHref>
                          <a>
                            <RouteCard
                              routeName={name}
                            // climbId={metadata.climb_id} not actually used
                              yds={yds}
                              safety={undefined} /// TODO: Find out what routes have this value?
                              type={type}
                            />
                          </a>
                        </Link>
                      </div>
                    )
                  }
                )}
              </div>
            </>
          </div>
        </div>
      </div>
    </Layout>
  )
}

const sortRoutes = (routes: Climb[], sortType: CragSortType): Climb[] => {
  switch (sortType.value) {
    case 'leftToRight': {
      return routes.sort(
        (a, b) =>
          parseInt(a.metadata.left_right_index, 10) -
          parseInt(b.metadata.left_right_index, 10)
      )
    }
    case 'grade': {
      return routes.sort(
        (a, b) =>
          getScoreForGrade(a.yds) -
          getScoreForGrade(b.yds)
      )
    }
    default:
      return routes
  }
}

export async function getStaticPaths (): Promise<any> {
  // Temporarily disable pre-rendering
  // https://github.com/OpenBeta/openbeta-graphql/issues/26
  // const rs = await graphqlClient.query<AreaResponseType>({
  //   query: gql`query EdgeAreasQuery($filter: Filter) {
  //   areas(filter: $filter) {
  //     area_name
  //     metadata {
  //       area_id
  //     }
  //   }
  // }`,
  //   variables: {
  //     filter: { leaf_status: { isLeaf: true } }
  //   }
  // })

  // const paths = rs.data.areas.map((area: AreaType) => ({
  //   params: { id: area.metadata.area_id }
  // }))

  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = gql`query AreaByID($id: ID) {
    area(id: $id) {
      id
      area_name
      metadata {
        area_id
        lat
        lng 
        left_right_index
      }
      pathTokens
      
      ancestors
      climbs {
        name
        fa
        yds
        safety
        type {
          trad
          tr
          sport
          mixed
          bouldering
          alpine
          aid
        }
        metadata {
          climb_id
        }
      }
      content {
        description 
      } 
    }
  }`

  const rs = await graphqlClient.query<AreaType>({
    query,
    variables: {
      id: params.id
    }
  })

  // Pass post data to the page via props
  return { props: rs.data }
}

export default Crag
