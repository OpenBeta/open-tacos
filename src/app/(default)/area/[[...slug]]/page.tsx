import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { MapPinLine, Lightbulb, ArrowRight } from '@phosphor-icons/react/dist/ssr'
import Markdown from 'react-markdown'

import PhotoMontage, { UploadPhotoCTA } from '@/components/media/PhotoMontage'
import { getAreaRSC } from '@/js/graphql/getAreaRSC'
import { StickyHeaderContainer } from '@/app/(default)/components/ui/StickyHeaderContainer'
import { AreaCrumbs } from '@/components/breadcrumbs/AreaCrumbs'
import { ArticleLastUpdate } from '@/components/edit/ArticleLastUpdate'
import { getMapHref, getFriendlySlug, getAreaPageFriendlyUrl, sanitizeName, parseUuidAsFirstParam } from '@/js/utils'
import { LazyAreaMap } from '@/components/maps/AreaMap'
import { DefaultPageContainer } from '@/app/(default)/components/ui/DefaultPageContainer'
import { AreaAndClimbPageActions } from '../../components/AreaAndClimb/AreaAndClimbPageActions'
import { SubAreasSection } from './sections/SubAreasSection'
import { ClimbListSection } from './sections/ClimbListSection'
import { CLIENT_CONFIG } from '@/js/configs/clientConfig'
import { PageBanner as LCOBanner } from '@/components/lco/PageBanner'
import { AuthorMetadata, OrganizationType, TagTargetType } from '@/js/types'
import { PageWithCatchAllUuidProps } from '@/js/types/pages'
/**
 * Page cache settings
 */
export const revalidate = 2592000 // 30 days

/**
 * Area/crag page
 */
export default async function Page ({ params }: PageWithCatchAllUuidProps): Promise<any> {
  const areaUuid = parseUuidAsFirstParam({ params })
  const pageData = await getAreaRSC(areaUuid)
  if (pageData == null || pageData.area == null) {
    notFound()
  }

  const userProvidedSlug = getFriendlySlug(params.slug?.[1] ?? '')

  const { area } = pageData

  const photoList = area?.media ?? []
  const { uuid, pathTokens, ancestors, areaName, content, authorMetadata, metadata, organizations } = area
  const { description, areaLocation } = content
  const { lat, lng, leaf } = metadata

  const correctSlug = getFriendlySlug(areaName)

  if (correctSlug !== userProvidedSlug) {
    permanentRedirect(getAreaPageFriendlyUrl(uuid, areaName))
  }

  return (
    <DefaultPageContainer
      photoGallery={
        photoList.length === 0
          ? <UploadPhotoCTA />
          : <PhotoMontage photoList={photoList} />
      }
      pageActions={<AreaAndClimbPageActions name={areaName} uuid={uuid} targetType={TagTargetType.area} parentUuid={uuid} />}
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
      summary={{
        left: (
          <AreaData
            areaName={areaName}
            lat={lat}
            lng={lng}
            authorMetadata={authorMetadata}
          />
        ),
        right: (
          <DescriptionSection
            uuid={uuid}
            description={description}
            organizations={organizations}
            areaLocation={areaLocation}
            leaf={leaf}
          />
        )
      }}
    >
      <hr className='border-1 my-8' />

      {/* An area can only have either subareas or climbs, but not both. */}
      <div className='mt-8'>
        <SubAreasSection area={area} />
        <ClimbListSection area={area} />
      </div>
    </DefaultPageContainer>
  )
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

const EditAreaLocationCTA: React.FC<{ uuid: string }> = ({ uuid }) => (
  <div role='alert' className='alert'>
    <Lightbulb size={24} />
    <div className='text-sm'>No information available.  Be the first to&nbsp;
      <Link href={`/editArea/${uuid}/general#areaLocation`} target='_new' className='link-dotted inline-flex items-center gap-1'>
        add a location<ArrowRight size={16} />
      </Link>
    </div>
  </div>
)

const DescriptionSection: React.FC<{ uuid: string, description: string, organizations: OrganizationType[], areaLocation: string, leaf: Boolean }> = ({
  uuid, description, organizations, areaLocation, leaf
}) => {
  return (
    <>
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
          </Link>
          ]
        </span>
      </div>
      {(description == null || description.trim() === '') && <EditDescriptionCTA uuid={uuid} />}
      <Markdown className='wiki-content'>{description}</Markdown>

      <hr className='border-1 mt-8 mb-4' />

      {/* Only show location info if it is a crag or boulder */}
      {leaf === true &&
        <AreaLocationSection uuid={uuid} areaLocation={areaLocation} />}

      <hr className='border-1 mt-8 mb-4' />

      <LCOBanner orgs={organizations} />
    </>
  )
}

const AreaLocationSection: React.FC<{ uuid: string, areaLocation?: string }> = ({
  uuid, areaLocation = ''
}) => {
  return (
    <>
      <div className='flex items-center gap-2'>
        <h3 className='font-bold'>Location</h3>
        <span className='text-xs inline-block align-baseline'>
          [
          <Link
            href={`/editArea/${uuid}/general#areaLocation`}
            target='_new'
            className='hover:underline'
          >
            Edit
          </Link>
          ]
        </span>
      </div>

      {(areaLocation == null || areaLocation.trim() === '') && <EditAreaLocationCTA uuid={uuid} />}
      <Markdown className='wiki-content'>{areaLocation}</Markdown>
    </>
  )
}

const AreaData: React.FC<{ areaName: string, lat: number, lng: number, authorMetadata: AuthorMetadata }> = ({
  areaName, lat, lng, authorMetadata
}) => {
  return (
    <>
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
    </>
  )
}

// Page metadata
export async function generateMetadata ({ params }: PageWithCatchAllUuidProps): Promise<Metadata> {
  const areaUuid = parseUuidAsFirstParam({ params })
  const area = await getAreaRSC(areaUuid, 'cache-first')

  if (area == null || area.area == null) {
    return {}
  }

  const { area: { uuid, areaName, pathTokens, media } } = area

  let wall = ''
  if (pathTokens.length >= 2) {
    // Get the ancestor area's name
    wall = sanitizeName(pathTokens[pathTokens.length - 2]) + ' • '
  }

  const name = sanitizeName(areaName)

  const previewImage = media.length > 0 ? `${CLIENT_CONFIG.CDN_BASE_URL}${media[0].mediaUrl}?w=1200&q=75` : null

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
