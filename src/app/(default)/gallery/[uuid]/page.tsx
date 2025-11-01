import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { fetchGalleryData } from '../util/galleryUtils'
import GalleryModalOpener from '../components/GalleryModalOpener'

export const revalidate = 3600 // Revalidate every hour

interface GalleryPageProps {
  params: Promise<{
    uuid: string
  }>
  searchParams: Promise<{
    type?: 'area' | 'climb'
    photoId?: string
  }>
}

export async function generateMetadata (
  { params, searchParams }: GalleryPageProps
): Promise<Metadata> {
  const { uuid } = await params
  const { type = 'area' } = await searchParams

  if (uuid === undefined) {
    return { title: 'Gallery' }
  }

  const gallery = await fetchGalleryData(uuid, type)

  if (gallery === null) {
    return { title: 'Gallery Not Found' }
  }

  return {
    title: `${gallery.name} Gallery`,
    description: `Photo gallery for ${gallery.name}`
  }
}

export default async function GalleryPage ({
  params,
  searchParams
}: GalleryPageProps): Promise<JSX.Element> {
  const { uuid } = await params
  const { type = 'area', photoId } = await searchParams

  if (uuid === undefined) {
    notFound()
  }

  const gallery = await fetchGalleryData(uuid, type)

  if (gallery === null || gallery.mediaList.length === 0) {
    return (
      <div className='min-h-screen bg-base-100 flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <h1 className='text-2xl font-bold'>No Photos Found</h1>
          <p className='text-base-content/60'>
            This {gallery == null ? 'location' : gallery.type} doesn't have any photos yet.
          </p>
          <Link href='/' className='btn btn-primary'>
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <GalleryModalOpener uuid={uuid} photoId={photoId} type={type} />
      <div className='min-h-screen bg-base-100 py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Navigation */}
          <div className='mb-6'>
            <Link
              href={`/${type}/${uuid}/${gallery.slug}`}
              className='text-blue-600 hover:underline text-sm'
            >
              ← Back to {gallery.name}
            </Link>
          </div>

          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-base-content mb-2'>
              {gallery.name} Gallery
            </h1>
            <p className='text-base-content/60'>
              {gallery.mediaList.length} photo{gallery.mediaList.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Gallery Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {gallery.mediaList.map((media, index) => {
              const mediaTitle = media.entityTags?.[0]?.climbName ?? media.entityTags?.[0]?.areaName
              return (
                <Link
                  key={media.id}
                  href={`/gallery/${uuid}/modal/${media.id}?type=${type}`}
                  className='group relative aspect-square overflow-hidden rounded-lg bg-base-200 hover:shadow-lg transition-shadow'
                >
                  <Image
                    src={media.mediaUrl}
                    alt={mediaTitle ?? `Photo ${index + 1}`}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform'
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                  />
                  {mediaTitle != null && (
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end'>
                      <p className='text-white p-3 text-sm line-clamp-2'>
                        {mediaTitle}
                      </p>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
