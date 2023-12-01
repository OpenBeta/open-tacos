import Link from 'next/link'
import { PencilSimple, ArrowElbowLeftDown } from '@phosphor-icons/react/dist/ssr'
import { ShareAreaLinkButton } from '@/app/components/ShareAreaLinkButton'
import { UploadPhotoButton } from '@/components/media/PhotoUploadButtons'

/**
 * Main action bar for area page
 */
export const AreaPageActions: React.FC<{ uuid: string, areaName: string } > = ({ uuid, areaName }) => (
  <ul className='max-w-sm md:max-w-md flex items-center justify-between gap-2 w-full'>
    <Link href={`/editArea/${uuid}`} target='_new' className='btn btn-solid btn-accent'>
      <PencilSimple size={20} weight='duotone' /> Edit
    </Link>

    <UploadPhotoButton />

    <Link href='#map' className='btn'>
      <ArrowElbowLeftDown size={20} className='hidden md:inline' /> Map
    </Link>
    <ShareAreaLinkButton uuid={uuid} areaName={areaName} />
  </ul>
)

/**
 * Skeleton.  Height = actual component's button height.
 */
export const AreaPageActionsSkeleton: React.FC = () => (<div className='w-80 bg-base-200 h-9 rounded-btn' />)
