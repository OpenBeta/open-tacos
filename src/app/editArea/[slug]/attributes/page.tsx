import { DashboardPageProps, getPageDataForEdit } from '../page'

export default async function AreaEditPage ({ params }: DashboardPageProps): Promise<any> {
  const { area } = await getPageDataForEdit(params.slug)
  return (<div>Attributes {JSON.stringify(area, null, 2)}</div>)
}
