import { useState } from 'react'
import { NextPage, GetStaticProps } from 'next'
import { gql } from '@apollo/client'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { graphqlClient } from '../../js/graphql/Client'
import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import ButtonGroup from '../../components/ui/ButtonGroup'
import { Button } from '../../components/ui/Button'
import Icon from '../../components/Icon'
import BreadCrumbs from '../../components/ui/BreadCrumbs'
import { AreaType, Climb } from '../../js/types'
import { getScoreForSort, GradeScales } from '@openbeta/sandbag'
import RouteCard from '../../components/ui/RouteCard'
import InlineEditor from '../../components/editor/InlineEditor'
import { sanitizeName } from '../../js/utils'
import PhotoMontage from '../../components/media/PhotoMontage'

interface CragProps {
  area: AreaType
}

interface CragSortType {
  value: string
  text: string
}

const CragPage: NextPage<CragProps> = ({ area }) => {
  const router = useRouter()

  return (
    <Layout contentContainerClass='content-default with-standard-y-margin'>
      {router.isFallback
        ? (
          <div className='px-4 max-w-screen-md'>
            <div>Loading...</div>
          </div>
          )
        : <Body area={area} />}
    </Layout>
  )
}
export default CragPage

const Body = ({ area }: CragProps): JSX.Element => {
  const { areaName, climbs, metadata, content, ancestors, pathTokens, media } = area

  const [selectedClimbSort, setSelectedClimbSort] = useState(0)
  const climbSortByOptions: CragSortType[] = [
    { value: 'leftToRight', text: 'Left To Right' },
    { value: 'grade', text: 'Grade' }
  ]
  return (
    <>
      <SeoTags
        keywords={[areaName]}
        title={areaName}
        description='description'
      />
      <div className='px-4 max-w-screen-md'>
        <BreadCrumbs ancestors={ancestors} pathTokens={pathTokens} />
        <h1 className='title'>{sanitizeName(areaName)}</h1>
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

        <PhotoMontage photoList={media} isHero />

        <div
          className='pt-4 markdown'
        >
          <h2>Description</h2>
          <InlineEditor id='crag-1' markdown={content.description} readOnly />
        </div>
        <hr className='my-8' />
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
              const { yds, name, type, safety, metadata } = climb
              const { climbId } = metadata
              return (
                <div className='pt-6 max-h-96' key={climbId}>
                  <Link href={`/climbs/${climbId}`} passHref>
                    <a>
                      <RouteCard
                        routeName={name}
                        yds={yds}
                        safety={safety} /// TODO: Find out what routes have this value?
                        type={type}
                      />
                    </a>
                  </Link>
                </div>
              )
            }
          )}
        </div>
      </div>
    </>
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
        (a, b) => getScoreForSort(a.yds, GradeScales.Yds) -
        getScoreForSort(b.yds, GradeScales.Yds)
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
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<CragProps, {id: string}> = async ({ params }) => {
  if (params == null || params.id == null) {
    return {
      notFound: true
    }
  }
  const query = gql`query AreaByID($uuid: ID) {
    area(uuid: $uuid) {
      id
      uuid
      areaName
      metadata {
        areaId
        lat
        lng 
        left_right_index
      }
      pathTokens
      ancestors
      media {
        mediaUrl
        mediaUuid
      }
      climbs {
        id
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
          climbId
        }
      }
      content {
        description 
      }
    }
  }`

  const rs = await graphqlClient.query<{area: AreaType}>({
    query,
    variables: {
      uuid: params.id
    }
  })

  if (rs.data === null) {
    return {
      notFound: true
    }
  }

  // Pass post data to the page via props
  return {
    props: {
      area: rs.data.area
    }
  }
}
