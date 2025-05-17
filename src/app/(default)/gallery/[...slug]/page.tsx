import Image from 'next/image'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getAreaPageFriendlyUrl,
  getClimbPageFriendlyUrl,
  parseUuidAsFirstParam
} from '@/js/utils'
import { PageWithCatchAllUuidProps } from '@/js/types/pages'
import { getAreaRSC } from '@/js/graphql/getAreaRSC'
import { getClimbByIdRSC } from '@/js/graphql/getClimbRSC'

interface GalleryPageProps extends PageWithCatchAllUuidProps {
  searchParams?: { [key: string]: string | string[] | undefined }
}

interface PhotoData {
  id: string
  mediaUrl: string
  [key: string]: any
}

interface EntityGalleryData {
  id: string
  name: string
  photos: PhotoData[]
  pageUrl: string
  type: 'area' | 'climb'
}

type AreaData = NonNullable<Awaited<ReturnType<typeof getAreaRSC>>['area']>
type ClimbData = NonNullable<Awaited<ReturnType<typeof getClimbByIdRSC>>>

const formatAreaData = (area: AreaData): EntityGalleryData => {
  const photos = (area.media ?? []).map(p => ({
    ...p,
    id: p.id,
    mediaUrl: p.mediaUrl
  }))

  return {
    type: 'area',
    id: area.uuid,
    name: area.areaName,
    photos,
    pageUrl: getAreaPageFriendlyUrl(area.uuid, area.areaName)
  }
}

const formatClimbData = (climb: ClimbData): EntityGalleryData => {
  const photos = (climb.media ?? []).map(p => ({
    ...p,
    id: p.id,
    mediaUrl: p.mediaUrl
  }))

  return {
    type: 'climb',
    id: climb.id,
    name: climb.name,
    photos,
    pageUrl: getClimbPageFriendlyUrl(climb.id, climb.name)
  }
}

export default async function GalleryPage ({ params, searchParams }: GalleryPageProps): Promise<JSX.Element> {
  const id = parseUuidAsFirstParam({ params })
  const entityTypeParam = searchParams?.type as 'area' | 'climb' | undefined

  if (id === '') {
    notFound()
  }

  let galleryData: EntityGalleryData | null = null

  try {
    // If type param is 'area', fetch only AREA
    if (entityTypeParam === 'area') {
      const areaData = await getAreaRSC(id)
      if (areaData?.area != null) {
        galleryData = formatAreaData(areaData.area)
      } else {
        notFound()
      }
    } else if (entityTypeParam === 'climb') {
      // If type param is 'climb', fetch only CLIMB
      const climbData = await getClimbByIdRSC(id)
      if (climbData != null) {
        galleryData = formatClimbData(climbData)
      } else {
        notFound()
      }
    } else {
      // If no type param or invalid, try to fetch both AREA and CLIMB
      const areaData = await getAreaRSC(id)
      if (areaData?.area != null) {
        galleryData = formatAreaData(areaData.area)
      } else {
        const climbData = await getClimbByIdRSC(id)
        if (climbData != null) {
          galleryData = formatClimbData(climbData)
        }
      }
    }
  } catch (error) {
    console.error(`Gallery data fetch failed for ID ${id}:`, error)
    notFound()
  }
  // if no galleryData, show notFound
  if (galleryData === null) {
    notFound()
  }

  const { name: entityName, photos: photoList, pageUrl: entityPageUrl, type: entityType } = galleryData

  return (
    <Suspense fallback={<LoadingGridState />}>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-2'>Photo Gallery for {entityName}</h1>
        <p className='mb-4 text-secondary'>
          <Link href={entityPageUrl} className='link-hover'>
            &larr; Back to {entityName} {entityType} page
          </Link>
        </p>

        {photoList.length === 0
          ? (
            <div className='mt-8 p-4 bg-gray-100 rounded-lg text-center text-gray-600'>
              <p>No photos have been uploaded for this {entityType} yet.</p>
              <p><strong>TODO: Add a CTA to upload photos</strong></p>
            </div>
            )
          : (
            <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {photoList.map((photo, index) => {
                const imageAltText = `Photo ${index + 1} for ${entityName} (${entityType}) - ID: ${photo.id}`

                return (
                  <Link
                    key={photo.id}
                    href={`/gallery/p/${id}/${photo.id}?type=${entityType}`}
                    className='relative aspect-square block bg-gray-100 rounded-lg overflow-hidden group'
                  >
                    <Image
                      src={photo.mediaUrl}
                      alt={imageAltText}
                      fill
                      sizes='(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw'
                      className='object-cover transition-transform duration-300 ease-in-out group-hover:scale-105'
                      priority={index < 4}
                    />
                  </Link>
                )
              })}
            </div>
            )}
      </div>
    </Suspense>
  )
}

function LoadingGridState (): JSX.Element {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='animate-pulse'>
        <div className='h-8 bg-gray-200 rounded w-3/4 mb-2' />
        <div className='h-4 bg-gray-200 rounded w-1/4 mb-8' />
        <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {[...Array(8)].map((_, index) => (
            <div key={index} className='aspect-square bg-gray-200 rounded-lg' />
          ))}
        </div>
      </div>
    </div>
  )
}
