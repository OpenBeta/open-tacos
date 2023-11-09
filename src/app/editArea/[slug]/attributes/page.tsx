import { EditPageProps, getPageDataForEdit } from '../page'

export default async function AreaEditPage ({ params }: EditPageProps): Promise<any> {
  const { area } = await getPageDataForEdit(params.slug)
  return (<div>Attributes {JSON.stringify(area, null, 2)}</div>)
}
