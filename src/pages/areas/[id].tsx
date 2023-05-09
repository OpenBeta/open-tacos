import { useState } from 'react'
import { NextPage, GetStaticProps } from 'next'
import { useRouter } from 'next/router'

import { AreaType, ChangesetType } from '../../js/types'
import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import BreadCrumbs from '../../components/ui/BreadCrumbs'
import AreaMap from '../../components/area/areaMap'
import SidePanel from '../../components/area/panel/sidePanel'
import { getSlug } from '../../js/utils'
import { getNavBarOffset } from '../../components/Header'
import PhotoMontage from '../../components/media/PhotoMontage'
import { useAreaSeo } from '../../js/hooks/seo'
import AreaEditTrigger from '../../components/edit/AreaEditTrigger'

interface AreaPageProps {
  area: AreaType
  history: ChangesetType[]
}

/**
 * Need to decide what to do with this page '/areas/<area id>' url since all the logic has been moved to 'crag/<area_id>'
 */
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

const Body = ({ area, history }: AreaPageProps): JSX.Element => {
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
      href: getSlug(child.metadata.areaId, child.metadata.leaf, child.children.length)
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
            <PhotoMontage isHero photoList={area.media} />
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
    paths: [],
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

  // redirect to the crag page for the time being
  return {
    redirect: {
      destination: `/crag/${params.id}`,
      permanent: false
    }
  }
}

/**
 * Generate dynamic meta tags for page
 */
export const PageMeta = ({ area }: AreaPageProps): JSX.Element => {
  const { pageImages, pageTitle, pageDescription } = useAreaSeo({ area })
  return (
    <SeoTags
      title={pageTitle}
      description={pageDescription}
      images={pageImages}
    />
  )
}
