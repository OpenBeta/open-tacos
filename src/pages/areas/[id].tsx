import { useState } from 'react'
import { NextPage, GetStaticProps } from 'next'
import { useRouter } from 'next/router'

import { QUERY_AREA_BY_ID } from '../../js/graphql/gql/areaById'
import { AreaType, MediaBaseTag, ChangesetType } from '../../js/types'
import { graphqlClient } from '../../js/graphql/Client'
import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import BreadCrumbs from '../../components/ui/BreadCrumbs'
import AreaMap from '../../components/area/areaMap'
import SidePanel from '../../components/area/panel/sidePanel'
import { getSlug } from '../../js/utils'
import { getNavBarOffset } from '../../components/Header'
import PhotoMontage from '../../components/media/PhotoMontage'
import { enhanceMediaListWithUsernames } from '../../js/usernameUtil'
import { useAreaSeo } from '../../js/hooks/seo'
import AreaEditTrigger from '../../components/edit/AreaEditTrigger'
import { getImageDimensionsHack } from '../../js/utils/hacks'

interface AreaPageProps {
  area: AreaType
  history: ChangesetType[]
  mediaListWithUsernames: MediaBaseTag[]
}

const Area: NextPage<AreaPageProps> = (props) => {
  const router = useRouter()
  return (
    <>
      {!router.isFallback && <PageMeta {...props} />}
      <Layout
        showFooter={false}
        showFilterBar={false}
        contentContainerClass='content-default'
      >
        {router.isFallback
          ? (
            <div className='px-4 max-w-screen-md h-screen'>
              <div>Loading...</div>
            </div>
            )
          : <Body {...props} />}
      </Layout>
    </>
  )
}

export default Area

const Body = ({ area, mediaListWithUsernames: enhancedMediaList, history }: AreaPageProps): JSX.Element => {
  const [focused, setFocused] = useState<null | string>(null)
  const [selected, setSelected] = useState<null | string>(null)
  const navbarOffset = getNavBarOffset()

  const items = area.children
    .map(child => ({
      id: child.metadata.areaId,
      name: child.areaName,
      description: child.content?.description,
      totalClimbs: child.totalClimbs,
      aggregate: child.aggregate,
      content: child.content,
      href: getSlug(child.metadata.areaId, child.metadata.leaf)
    })
    )

  const { areaName, children, metadata, content, pathTokens, ancestors } = area

  return (
    <>
      <div
        className='flex overflow-y-auto'
        style={{ height: `calc(100vh - ${navbarOffset}px)` }}
      >
        <div
          className='p-6 flex-1 overflow-y-auto'
          style={{
            height: `calc(100vh - ${navbarOffset}px)`,
            scrollSnapType: 'y mandatory'
          }}
        >
          <div className='pt-4'>
            <BreadCrumbs ancestors={ancestors} pathTokens={pathTokens} />
            <div className='mt-4' />
            <PhotoMontage isHero photoList={enhancedMediaList} />
          </div>
          <div className='mt-4 md:flex md:justify-end'>
            <AreaEditTrigger {...area} history={history} />
          </div>
          <div className='mt-16'>
            <SidePanel
              onFocus={d => setFocused(d)}
              onSelect={d => setSelected(d)}
              items={items}
              selected={selected}
              focused={focused}
              title={areaName}
              description={content.description}
              longitude={metadata.lng}
              latitude={metadata.lat}
            />
          </div>
        </div>

        <div className='md:1-1/4 lg:w-1/2'>
          <AreaMap
            focused={focused}
            selected={selected}
            subAreas={children}
            area={area}
          />
        </div>
      </div>
    </>
  )
}

/**
 * This function gets called at build time.
 * Nextjs uses the result to decide which paths will get pre-rendered at build time
 */
export async function getStaticPaths (): Promise<any> {
  return {
    paths: [
      { params: { id: 'bea6bf11-de53-5046-a5b4-b89217b7e9bc' } }, // Red Rock
      { params: { id: '78da26bc-cd94-5ac8-8e1c-815f7f30a28b' } }, // Red River Gorge
      { params: { id: '1db1e8ba-a40e-587c-88a4-64f5ea814b8e' } }, // USA
      { params: { id: 'ab48aed5-2e8d-54bb-b099-6140fe1f098f' } }, // Colorado
      { params: { id: 'decc1251-4a67-52b9-b23f-3243e10e93d0' } }, // Boulder
      { params: { id: 'f166e672-4a52-56d3-94f1-14c876feb670' } } // Indian Creek
    ],
    fallback: true
  }
}

// This also gets called at build time
// Query graphql api for area by id
export const getStaticProps: GetStaticProps<AreaPageProps, {id: string}> = async ({ params }) => {
  if (params == null || params.id == null) {
    return {
      notFound: true
    }
  }

  const rs = await graphqlClient.query<{ area: AreaType, getAreaHistory: ChangesetType[] }>({
    query: QUERY_AREA_BY_ID,
    variables: {
      uuid: params.id
    },
    fetchPolicy: 'no-cache'
  })

  if (rs.data.area == null) {
    return {
      notFound: true,
      revalidate: 10
    }
  }

  const mediaListWithUsernames = await enhanceMediaListWithUsernames(rs.data.area.media)

  const mediaListWithDimensions = await getImageDimensionsHack(mediaListWithUsernames)

  // Pass Area & edit history data to the page via props
  return {
    props: {
      area: rs.data.area,
      history: rs.data.getAreaHistory,
      mediaListWithUsernames: mediaListWithDimensions
    },
    revalidate: 10
  }
}

/**
 * Generate dynamic meta tags for page
 */
export const PageMeta = ({ area, mediaListWithUsernames }: AreaPageProps): JSX.Element => {
  const { pageImages, pageTitle, pageDescription } = useAreaSeo({ area, imageList: mediaListWithUsernames })
  return (
    <SeoTags
      title={pageTitle}
      description={pageDescription}
      images={pageImages}
    />
  )
}
