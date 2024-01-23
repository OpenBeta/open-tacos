import { GlobalMap } from '@/components/maps/GlobalMap'
import { ProfileMenu } from '../components/ProfileMenu'
export default function MapPage (): any {
  return (
    <div className='w-full h-full'>
      <ProfileMenu />
      <GlobalMap
        showFullscreenControl={false}
      />
    </div>
  )
}
