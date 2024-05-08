import { notFound } from 'next/navigation'
import { getArea } from '@/js/graphql/getArea'
import { GalleryThumbnails } from './components/GalleryThumbnails'

interface TopoPageParams {
  params: { id: string }
}

export default async function TopoPage ({ params: { id } }: TopoPageParams): Promise<JSX.Element> {
  const pageData = await getArea(id)
  if (pageData == null || pageData.area == null) {
    notFound()
  }
  const { area } = pageData
  return (
    <article className='default-page-margins mt-6'>
      <h1 className='mt-4'>{area.areaName}</h1>
      <GalleryThumbnails {...area} />
    </article>
  )
}
