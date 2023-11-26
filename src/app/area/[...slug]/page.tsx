import { notFound, redirect } from 'next/navigation'
import slugify from 'slugify'
import { validate } from 'uuid'
import { MapPinLine } from '@phosphor-icons/react/dist/ssr'
import 'mapbox-gl/dist/mapbox-gl.css'
import Markdown from 'react-markdown'

import PhotoMontage from '@/components/media/PhotoMontage'
import { getArea } from '@/js/graphql/getArea'
import { StickyHeaderContainer } from '@/app/components/ui/StickyHeaderContainer'
import { GluttenFreeCrumbs } from '@/components/ui/BreadCrumbs'
import { ArticleLastUpdate } from '@/components/edit/ArticleLastUpdate'
import { getMapHref } from '@/js/utils'
import AreaMap from '@/components/area/areaMap'
import { PageContainer } from '@/app/components/ui/PageContainer'
/**
 * Cache duration in seconds
 */
export const revalidate = 30

export interface PageWithCatchAllUuidProps {
  params: {
    slug: string[]
  }
}

export default async function Page ({ params }: PageWithCatchAllUuidProps): Promise<any> {
  const areaUuid = parseUuidAsFirstParam({ params })
  const pageData = await getArea(areaUuid)
  if (pageData == null) {
    notFound()
  }

  const optionalNamedSlug = slugify(params.slug?.[1] ?? '', { lower: true, strict: true }).substring(0, 50)

  const { area } = pageData

  const photoList = area?.media ?? []
  const { uuid, pathTokens, ancestors, areaName, content, authorMetadata, metadata } = area
  const { description } = content
  const { lat, lng } = metadata

  const friendlySlug = slugify(areaName, { lower: true, strict: true }).substring(0, 50)

  if (friendlySlug !== optionalNamedSlug) {
    redirect(`/area/${uuid}/${friendlySlug}`)
  }

  return (
    <PageContainer
      map={
        <AreaMap
          focused={null}
          selected={area.id}
          subAreas={area.children}
          area={area}
        />
      }
    >
      <PhotoMontage isHero photoList={photoList} />

      <StickyHeaderContainer>
        <GluttenFreeCrumbs pathTokens={pathTokens} ancestors={ancestors} />
      </StickyHeaderContainer>

      <div className='area-climb-page-summary'>
        <div className='area-climb-page-summary-left'>
          <h1>{areaName}</h1>

          <div className='mt-6 flex flex-col text-xs text-base-300 border-t border-b  divide-y'>
            <a
              href={getMapHref({
                lat,
                lng
              })}
              target='blank'
              className='flex items-center gap-2 py-3'
            >
              <MapPinLine size={20} />
              <span className='mt-0.5'>
                <b>LAT,LNG</b>&nbsp;
                <span className='link-dotted'>
                  {lat.toFixed(5)}, {lng.toFixed(5)}
                </span>
              </span>
            </a>
            <ArticleLastUpdate {...authorMetadata} />
          </div>

        </div>
        <div className='area-climb-page-summary-right'>
          <h3>Description</h3>
          <Markdown>{description}</Markdown>
        </div>
      </div>
    </PageContainer>
  )
}

/**
 * Extract and validate uuid as the first param in a catch-all route
 */
const parseUuidAsFirstParam = ({ params }: PageWithCatchAllUuidProps): string => {
  if (params.slug.length === 0) {
    notFound()
  }

  const uuid = params.slug[0]
  if (!validate(uuid)) {
    console.error('Invalid uuid', uuid)
    notFound()
  }
  return uuid
}
