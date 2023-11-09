import { notFound } from 'next/navigation'
import { validate } from 'uuid'

import { AreaPageDataProps, getArea } from '@/js/graphql/getArea'
import { AreaNameForm } from './general/AreaNameForm'
import { AreaDescriptionForm } from './general/AreaDescriptionForm'
import { AreaLatLngForm } from './general/AreaLatLngForm'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

interface Props {
  params: {
    slug: string
  }
}

export default async function AreaEditPage ({ params }: Props): Promise<any> {
  const areaUuid = params.slug
  if (!validate(areaUuid)) {
    notFound()
  }
  const { area: { areaName, uuid, content: { description }, metadata: { lat, lng } } } = await getPageDataForEdit(areaUuid)
  return (
    <section className='w-full flex flex-col gap-y-8'>
      <AreaNameForm initialValue={areaName} uuid={uuid} />
      <AreaLatLngForm initLat={lat} initLng={lng} uuid={uuid} />
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
