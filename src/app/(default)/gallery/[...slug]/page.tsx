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
import { CLIENT_CONFIG } from '@/js/configs/clientConfig'
import { UploadPhotoCTA } from '@/components/media/PhotoMontage'

interface GalleryPageProps extends PageWithCatchAllUuidProps {
  searchParams?: { [key: string]: string | string[] | undefined }
}

interface EntityGalleryData {
  id: string
  name: string
  photos: Array<{ mediaUrl: string, [key: string]: any }>
  pageUrl: string
  type: 'area' | 'climb'
}

type AreaData = NonNullable<Awaited<ReturnType<typeof getAreaRSC>>['area']>
type ClimbData = NonNullable<Awaited<ReturnType<typeof getClimbByIdRSC>>>

const formatAreaData = (area: AreaData): EntityGalleryData => ({
  type: 'area',
  id: area.uuid,
  name: area.areaName,
  photos: area.media ?? [],
  pageUrl: getAreaPageFriendlyUrl(area.uuid, area.areaName)
})

const formatClimbData = (climb: ClimbData): EntityGalleryData => ({
  type: 'climb',
  id: climb.id,
  name: climb.name,
  photos: climb.media ?? [],
  pageUrl: getClimbPageFriendlyUrl(climb.id, climb.name)
})

export default async function GalleryPage ({ params, searchParams }: GalleryPageProps): Promise<JSX.Element> {
  const id = parseUuidAsFirstParam({ params })
  const entityTypeParam = searchParams?.type as 'area' | 'climb' | undefined

  // if no id is found, show notFound
  if (id === '') {
    notFound()
  }

  let galleryData: EntityGalleryData | null = null

  try {
    // If type param is 'area', fetch only AREA
    if (entityTypeParam === 'area') {
      const areaData = await getAreaRSC(id)
      if ((areaData?.area) != null) {
        galleryData = formatAreaData(areaData.area)
      } else {
        // If explicitly asked for area and not found, call notFound() directly
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
    notFound()
  }

  // if no galleryData, show notFound
  if (galleryData == null) {
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
              <UploadPhotoCTA />
              <p className='mt-2'><Link href={`/upload?${entityType}Id=${id}`} className='btn btn-primary'>Upload Photos</Link></p>
            </div>
            )
          : (
            <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {photoList.map((photo, index) => {
                const imageUrl = `${CLIENT_CONFIG.CDN_BASE_URL}${photo.mediaUrl}?w=400&q=75`
                const imageAltText = `Photo ${index + 1} for ${entityName} (${entityType})`

                return (
                  <div key={photo.mediaUrl !== '' ? photo.mediaUrl : index} className='aspect-square bg-gray-100 rounded-lg overflow-hidden'>
                    <img
                      src={imageUrl}
                      alt={imageAltText}
                      className='w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105'
                      loading='lazy'
                    />
                  </div>
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
