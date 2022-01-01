import { useState } from 'react'
import { GetStaticProps } from 'next'
import { gql } from '@apollo/client'
import { graphqlClient } from '../../js/graphql/Client'
import Link from 'next/link'
import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import { templateH1Css } from '../../js/styles'
import ButtonGroup from '../../components/ui/ButtonGroup'
import { Button } from '../../components/ui/Button'
import EditButton from '../../components/ui/EditButton'
import Cta from '../../components/ui/Cta'
import Icon from '../../components/Icon'
import BreadCrumbs from '../../components/ui/BreadCrumbs'
import { AreaType, Climb, AreaResponseType } from '../../js/types'
import { getScoreForYdsGrade } from '../../js/utils'
import RouteCard from '../../components/ui/RouteCard'

interface CragProps {
  area: AreaType
}

interface CragSortType {
  value: string
  text: string
}

const Crag = ({ area }: CragProps): JSX.Element => {
  const { area_name: areaName, climbs, metadata, content, pathTokens } = area

  const [selectedClimbSort, setSelectedClimbSort] = useState(0)
  const climbSortByOptions: CragSortType[] = [
    { value: 'leftToRight', text: 'Left To Right' },
    { value: 'grade', text: 'Grade' }
  ]

  const rawPath = '/'
  const showEditCTA = content.description.length < 40
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
            <BreadCrumbs pathTokens={pathTokens} />
            <h1 className={templateH1Css}>{areaName}</h1>
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
            {!showEditCTA && (
              <div className='flex justify-end'>
                <EditButton label='Improve this page' rawPath={rawPath} />
              </div>
            )}
            {showEditCTA && (
              <Cta isEmpty={content.description.length === 1} rawPath={rawPath} />
            )}
            <div
              className='markdown'
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
            <hr className='my-8' />
            <>
              <div className='divide-x markdown h1'>Climbs</div>
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
                        <Link href={`/climbs/${metadata.climb_id}`}>
                          <a>
                            <RouteCard
                              routeName={name}
                            // climbId={metadata.climb_id} not actually used
                              YDS={yds}
                              onPress={null}
                              safety={null} /// TODO: Find out what routes have this value?
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
          getScoreForYdsGrade(a.yds) -
          getScoreForYdsGrade(b.yds)
      )
    }
    default:
      return routes
  }
}

export async function getStaticPaths (): Promise<any> {
  const rs = await graphqlClient.query<AreaResponseType>({
    query: gql`query EdgeAreasQuery($filter: Filter) {
    areas(filter: $filter) {
      area_name
      metadata {
        area_id
      }
    }
  }`,
    variables: {
      filter: { leaf_status: { isLeaf: true } }
    }
  })

  const paths = rs.data.areas.map((area: AreaType) => ({
    params: { id: area.metadata.area_id }
  }))

  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = gql`query AreaByUUID($uuid: String) {
    area(uuid: $uuid) {
      area_name
      metadata {
        area_id
        lat
        lng 
        left_right_index
      }
      pathTokens
      climbs {
        name
        fa
        yds
        safety
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
      uuid: params.id
    }
  })

  // Pass post data to the page via props
  return { props: rs.data }
}

export default Crag
