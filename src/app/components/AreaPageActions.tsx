import Link from 'next/link'
import { PencilSimple, ArrowElbowLeftDown } from '@phosphor-icons/react/dist/ssr'
import { ShareAreaLinkButton } from '@/app/components/ShareAreaLinkButton'
import { UploadPhotoButton } from '@/components/NewPost'

/**
 * Main action bar for area page
 */
export const AreaPageActions: React.FC<{ uuid: string, areaName: string } > = ({ uuid, areaName }) => (
  <ul className='flex items-center justify-between gap-2'>
    <Link href={`/editArea/${uuid}`} className='btn btn-solid btn-accent'>
      <PencilSimple size={20} weight='duotone' /> Edit
    </Link>

    <UploadPhotoButton />

    <Link href='#map' className='btn'>
      <ArrowElbowLeftDown size={20} /> Map
    </Link>
    <ShareAreaLinkButton uuid={uuid} areaName={areaName} />
  </ul>
)

/**
 * Skeleton.  Height = actual component's button height.
 */
export const AreaPageActionsSkeleton: React.FC = () => (<div className='w-80 bg-base-200 h-9 rounded-btn' />)
