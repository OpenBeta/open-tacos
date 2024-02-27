import { ProfileMenu } from '../components/ProfileMenu'
import { FullScreenMap } from '../components/FullScreenMap'

export const dynamic = 'force-dynamic'

export default async function MapPage (): Promise<any> {
  return (
    <div className='w-full h-full'>
      <ProfileMenu />
      <FullScreenMap />
    </div>
  )
}
