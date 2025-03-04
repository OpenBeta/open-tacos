import { headers } from 'next/headers'
import { ProfileMenu } from '../components/ProfileMenu'
import { FullScreenMap } from '../components/FullScreenMap'

export const dynamic = 'force-dynamic'

export default async function MapPage (): Promise<any> {
  const headersList = await headers()
  const center = parseUserLatLng(headersList.get('cf-iplongitude'), headersList.get('cf-iplatitude'))
  return (
    <div className='w-full h-full'>
      <ProfileMenu />
      <FullScreenMap center={center} />
    </div>
  )
}

const parseUserLatLng = (lng: string | null, lat: string | null): [number, number] | undefined => {
  if (lng != null && lat != null) {
    return [parseFloat(lng), parseFloat(lat)]
  }
  return undefined
}
