import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import { validate } from 'uuid'
import { MapPinLine, Lightbulb, ArrowRight } from '@phosphor-icons/react/dist/ssr'
import 'mapbox-gl/dist/mapbox-gl.css'
import Markdown from 'react-markdown'

import PhotoMontage from '@/components/media/PhotoMontage'
import { getArea } from '@/js/graphql/getArea'
import { StickyHeaderContainer } from '@/app/components/ui/StickyHeaderContainer'
import { GluttenFreeCrumbs } from '@/components/ui/BreadCrumbs'
import { ArticleLastUpdate } from '@/components/edit/ArticleLastUpdate'
import { getMapHref, getFriendlySlug, getAreaPageFriendlyUrl } from '@/js/utils'
import AreaMap from '@/components/area/areaMap'
import { AreaPageContainer } from '@/app/components/ui/AreaPageContainer'
import { AreaPageActions } from '../../components/AreaPageActions'
import { SubAreasSection } from './sections/SubAreasSection'
import { ClimbListSection } from './sections/ClimbListSection'

/**
 * Cache duration in seconds
 */
export const revalidate = 30

export interface PageWithCatchAllUuidProps {
  params: {
    slug: string[]
  }
}

/**
 * Area/crag page
 */
export default async function Page ({ params }: PageWithCatchAllUuidProps): Promise<any> {
  const areaUuid = parseUuidAsFirstParam({ params })
  const pageData = await getArea(areaUuid)
  if (pageData == null) {
    notFound()
  }

  const userProvidedSlug = getFriendlySlug(params.slug?.[1] ?? '')

  const { area } = pageData

  const photoList = area?.media ?? []
  const { uuid, pathTokens, ancestors, areaName, content, authorMetadata, metadata } = area
  const { description } = content
  const { lat, lng } = metadata

  const correctSlug = getFriendlySlug(areaName)

  if (correctSlug !== userProvidedSlug) {
    permanentRedirect(getAreaPageFriendlyUrl(uuid, areaName))
  }

  return (
    <AreaPageContainer
      photoGallery={<PhotoMontage isHero photoList={photoList} />}
      breadcrumbs={
        <StickyHeaderContainer>
          <GluttenFreeCrumbs pathTokens={pathTokens} ancestors={ancestors} />
        </StickyHeaderContainer>
      }
      map={
        <AreaMap
          focused={null}
          selected={area.id}
          subAreas={area.children}
          area={area}
        />
      }
    >
      <div className='area-climb-page-summary'>
        <div className='area-climb-page-summary-left'>
          <h1>{areaName}</h1>

          <div className='mt-6 flex flex-col text-xs text-secondary border-t border-b  divide-y'>
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

          <AreaPageActions uuid={uuid} areaName={areaName} />
        </div>

        <div className='area-climb-page-summary-right'>
          <div className='flex items-center gap-2'>
            <h3>Description</h3>
            <span className='text-xs inline-block align-baseline'>
              [<Link href={`/editArea/${uuid}/general#description`} className='hover:underline'>Edit</Link>]
            </span>
          </div>
          {(description == null || description.trim() === '') && <EditDescriptionCTA uuid={uuid} />}
          <Markdown>{description}</Markdown>
        </div>

      </div>

      <SubAreasSection area={area} />
      <ClimbListSection area={area} />
    </AreaPageContainer>
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

const EditDescriptionCTA: React.FC<{ uuid: string }> = ({ uuid }) => (
  <div role='alert' className='alert'>
    <Lightbulb size={24} />
    <div className='text-sm'>No description available.  Be the first to contribute!
      <div className='mt-2'>
        <Link href={`/editArea/${uuid}/general#description`} className='btn btn-sm btn-outline'>
          Add description <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  </div>
)
