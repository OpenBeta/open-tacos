import { notFound } from 'next/navigation'
import { AreaPageDataProps, getArea } from '@/js/graphql/getArea'
import { AreaNameForm } from './general/AreaNameForm'
import { AreaDescriptionForm } from './general/AreaDescriptionForm'

export interface EditPageProps {
  params: {
    slug: string
  }
}

export default async function AreaEditPage ({ params }: EditPageProps): Promise<any> {
  const { area: { areaName, uuid, content: { description } } } = await getPageDataForEdit(params.slug)
  return (
    <section className='w-full flex flex-col gap-y-8'>
      <AreaNameForm initialValue={areaName} uuid={uuid} />
      <AreaDescriptionForm initialValue={description} uuid={uuid} />
    </section>
  )
}

export const getPageDataForEdit = async (uuid: string): Promise<AreaPageDataProps> => {
  if (uuid == null) notFound()

  const pageData = await getArea(uuid)
  if (pageData == null) {
    notFound()
  }
  return pageData
}
