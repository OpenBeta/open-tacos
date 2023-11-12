import { notFound, redirect } from 'next/navigation'
import slugify from 'slugify'
import { validate } from 'uuid'

import PhotoMontage from '@/components/media/PhotoMontage'
import { getArea } from '@/js/graphql/getArea'
import { StickyHeaderContainer } from '@/app/components/ui/StickyHeaderContainer'

import BreadCrumbs from '@/components/ui/BreadCrumbs'

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
  const { uuid, pathTokens, ancestors, areaName, content } = area
  const { description } = content

  const friendlySlug = slugify(areaName, { lower: true, strict: true }).substring(0, 50)

  if (friendlySlug !== optionalNamedSlug) {
    redirect(`/area/${uuid}/${friendlySlug}`)
  }

  return (
    <article className='p-4  mx-auto max-w-5xl xl:max-w-7xl'>
      <PhotoMontage isHero photoList={photoList} />

      <StickyHeaderContainer>
        <BreadCrumbs pathTokens={pathTokens} ancestors={ancestors} />
      </StickyHeaderContainer>

      <div className='area-climb-page-summary'>
        <div className='area-climb-page-summary-left'>
          <h3>{areaName}</h3>

          {/* {
                    latlngPair != null && (
                      <div className='flex flex-col text-xs text-base-300 border-t border-b  divide-y'>
                        <a
                          href={getMapHref({
                            lat: latlngPair[0],
                            lng: latlngPair[1]
                          })}
                          target='blank'
                          className='flex items-center gap-2 py-3'
                        >
                          <MapPinIcon className='w-5 h-5' />
                          <span className='mt-0.5'>
                            <b>LAT,LNG</b>&nbsp;
                            <span className='link-dotted'>
                              {latlngPair[0].toFixed(5)}, {latlngPair[1].toFixed(5)}
                            </span>
                          </span>
                        </a>
                        {/* <ArticleLastUpdate {...authorMetadata} /> */}

        </div>
        <div className='area-climb-page-summary-right'>
          <h3>Description</h3>
          <div>{description}</div>
        </div>
      </div>

      {/* {JSON.stringify(pageData.area, null, 2)} */}
    </article>
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
