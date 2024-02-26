import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { validate } from 'uuid'
import { MapPinLine, Lightbulb, ArrowRight } from '@phosphor-icons/react/dist/ssr'
import Markdown from 'react-markdown'

import PhotoMontage, { UploadPhotoCTA } from '@/components/media/PhotoMontage'
import { getArea } from '@/js/graphql/getArea'
import { StickyHeaderContainer } from '@/app/(default)/components/ui/StickyHeaderContainer'
import { AreaCrumbs } from '@/components/breadcrumbs/AreaCrumbs'
import { ArticleLastUpdate } from '@/components/edit/ArticleLastUpdate'
import { getMapHref, getFriendlySlug, getAreaPageFriendlyUrl, sanitizeName } from '@/js/utils'
import { LazyAreaMap } from '@/components/maps/AreaMap'
import { AreaPageContainer } from '@/app/(default)/components/ui/AreaPageContainer'
import { AreaPageActions } from '../../components/AreaPageActions'
import { SubAreasSection } from './sections/SubAreasSection'
import { ClimbListSection } from './sections/ClimbListSection'
import { CLIENT_CONFIG } from '@/js/configs/clientConfig'
import { PageBanner as LCOBanner } from '@/components/lco/PageBanner'
/**
 * Page cache settings
 */
export const revalidate = 86400 // 24 hours
export const fetchCache = 'force-no-store' // opt out of Nextjs version of 'fetch'

interface PageSlugType {
  slug: string []
}
export interface PageWithCatchAllUuidProps {
  params: PageSlugType
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
  const { uuid, pathTokens, ancestors, areaName, content, authorMetadata, metadata, organizations } = area
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
          : <PhotoMontage photoList={photoList} />
      }
      pageActions={<AreaPageActions areaName={areaName} uuid={uuid} />}
      breadcrumbs={
        <StickyHeaderContainer>
          <AreaCrumbs pathTokens={pathTokens} ancestors={ancestors} />
        </StickyHeaderContainer>
      }
      map={
        <LazyAreaMap
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

          <div className='mt-6 flex flex-col text-xs text-secondary border-t border-b divide-y'>
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
            <h3 className='font-bold'>Description</h3>
            <span className='text-xs inline-block align-baseline'>
              [
              <Link
                href={`/editArea/${uuid}/general#description`}
                target='_new'
                className='hover:underline'
              >
                Edit
              </Link>]
            </span>
          </div>
          {(description == null || description.trim() === '') && <EditDescriptionCTA uuid={uuid} />}
          <Markdown className='wiki-content'>{description}</Markdown>

          <hr className='border-1 mt-8 mb-4' />

          <LCOBanner orgs={organizations} />
        </div>
      </div>

      <hr className='border-1 my-8' />

      {/* An area can only have either subareas or climbs, but not both. */}
      <div className='mt-8'>
        <SubAreasSection area={area} />
        <ClimbListSection area={area} />
      </div>
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
      <Link href={`/editArea/${uuid}/general#description`} target='_new' className='link-dotted inline-flex items-center gap-1'>
        add a description <ArrowRight size={16} />
      </Link>
    </div>
  </div>
)

/**
 * List of area pages to prebuild
 */
export function generateStaticParams (): PageSlugType[] {
  const list = [
    { slug: ['bea6bf11-de53-5046-a5b4-b89217b7e9bc'] }, // Red Rock
    { slug: ['78da26bc-cd94-5ac8-8e1c-815f7f30a28b'] }, // Red River Gorge
    { slug: ['1db1e8ba-a40e-587c-88a4-64f5ea814b8e'] }, // USA
    { slug: ['ab48aed5-2e8d-54bb-b099-6140fe1f098f'] }, // Colorado
    { slug: ['decc1251-4a67-52b9-b23f-3243e10e93d0'] }, // Boulder
    { slug: ['f166e672-4a52-56d3-94f1-14c876feb670'] }, // Indian Creek
    { slug: ['5f0ed4d8-ebb0-5e78-ae15-ba7f1b3b5c51'] }, // Wasatch range
    { slug: ['b1166235-3328-5537-b5ed-92f406ea8495'] }, // Lander
    { slug: ['9abad566-2113-587e-95a5-b3abcfaa28ac'] } // Ten Sleep
  ]
  if (process.env.VERCEL_ENV !== 'production') {
    return list.slice(0, 1)
  }
  return list
}

// Page metadata
export async function generateMetadata ({ params }: PageWithCatchAllUuidProps): Promise<Metadata> {
  const areaUuid = parseUuidAsFirstParam({ params })

  const { area: { uuid, areaName, pathTokens, media } } = await getArea(areaUuid, 'cache-first')

  let wall = ''
  if (pathTokens.length >= 2) {
    // Get the ancestor area's name
    wall = sanitizeName(pathTokens[pathTokens.length - 2]) + ' • '
  }

  const name = sanitizeName(areaName)

  const previewImage = media.length > 0 ? `${CLIENT_CONFIG.CDN_BASE_URL}/${media[0].mediaUrl}?w=1200q=75` : null

  const description = `Community knowledge • ${wall}${name}`

  return {
    title: `${name} climbing area`,
    alternates: {
      canonical: `https://openbeta.io/area/${uuid}/${getFriendlySlug(areaName)}`
    },
    description,
    openGraph: {
      description,
      ...previewImage != null && { images: previewImage }
    }
  }
}
