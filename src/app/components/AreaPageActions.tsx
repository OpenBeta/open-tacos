import Link from 'next/link'
import { PencilSimple, ArrowElbowLeftDown } from '@phosphor-icons/react/dist/ssr'
import { ShareAreaLinkButton } from '@/app/components/ShareAreaLinkButton'

/**
 * Main action bar for area page
 */
export const AreaPageActions: React.FC<{ uuid: string, areaName: string } > = ({ uuid, areaName }) => (
  <ul className='mt-6 flex items-center justify-between'>
    <Link href={`/editArea/${uuid}`} className='btn btn-solid btn-accent'>
      <PencilSimple size={20} weight='duotone' /> Edit
    </Link>
    <Link href='#map' className='btn'>
      <ArrowElbowLeftDown size={20} /> Map
    </Link>
    <ShareAreaLinkButton uuid={uuid} areaName={areaName} />
  </ul>
)
