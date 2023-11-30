import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import { validate } from 'uuid'
import { MapPinLine, Lightbulb, ArrowRight } from '@phosphor-icons/react/dist/ssr'
import 'mapbox-gl/dist/mapbox-gl.css'
import Markdown from 'react-markdown'

import PhotoMontage, { UploadPhotoCTA } from '@/components/media/PhotoMontage'
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
 * Page cache settings
 */
export const revalidate = 86400 // 24 hours
export const fetchCache = 'force-no-store' // opt out of Nextjs version of 'fetch'

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
      photoGallery={
        photoList.length === 0
          ? <UploadPhotoCTA />
          : <PhotoMontage isHero photoList={photoList} />
      }
      pageActions={<AreaPageActions areaName={areaName} uuid={uuid} />}
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
    <div className='text-sm'>No information available.  Be the first to&nbsp;
      <Link href={`/editArea/${uuid}/general#description`} className='link-dotted inline-flex items-center gap-1'>
        add a description <ArrowRight size={16} />
      </Link>
    </div>
  </div>
)

/**
 * List of area pages to prebuild
 */
export function generateStaticParams (): PageWithCatchAllUuidProps[] {
  return [
    { params: { slug: ['bea6bf11-de53-5046-a5b4-b89217b7e9bc'] } }, // Red Rock
    { params: { slug: ['78da26bc-cd94-5ac8-8e1c-815f7f30a28b'] } }, // Red River Gorge
    { params: { slug: ['1db1e8ba-a40e-587c-88a4-64f5ea814b8e'] } }, // USA
    { params: { slug: ['ab48aed5-2e8d-54bb-b099-6140fe1f098f'] } }, // Colorado
    { params: { slug: ['decc1251-4a67-52b9-b23f-3243e10e93d0'] } }, // Boulder
    { params: { slug: ['f166e672-4a52-56d3-94f1-14c876feb670'] } }, // Indian Creek
    { params: { slug: ['5f0ed4d8-ebb0-5e78-ae15-ba7f1b3b5c51'] } }, // Wasatch range
    { params: { slug: ['b1166235-3328-5537-b5ed-92f406ea8495'] } }, // Lander
    { params: { slug: ['9abad566-2113-587e-95a5-b3abcfaa28ac'] } } // Ten Sleep
  ]
}
